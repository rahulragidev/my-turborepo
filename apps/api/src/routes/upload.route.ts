import KoaBody from "koa-body"
import Router from "@koa/router"
import fs from "fs/promises"
import { GraphQLError } from "libs/graphql-error"
//import { uploadFile } from "functions/s3"

import { AssetModel } from "entities/asset/asset.type"
import {
    IUploadFileInput,
    uploadFile
} from "libs/cloudflare/upload-to-cloudflare-r2"
import { authHandler } from "auth/auth-handler"
import type { File } from "formidable"

const withBody = KoaBody({
    multipart: true,
    formidable: {
        multiples: false
    }
})

export const router = new Router({ prefix: "/api/upload" })

// TODO: move this logic to GraphQL-upload
router.post("/", withBody, async context => {
    const file = context.request.files!.file as File
    try {
        if (!file)
            throw new GraphQLError("no file found or file name is not file")

        console.log(
            `upload route has been hit with context headers: \n ${JSON.stringify(
                context.headers,
                null,
                2
            )}`
        )

        const body = context.body
        console.log(`body: ${JSON.stringify(body, null, 2)}`)

        // get file size file
        const stats = await fs.stat(file.filepath)
        console.log(`file size: ${stats.size}`)
        //const { fileTypeFromFile } = await import("file-type")
        if (!context.header.authorization)
            throw new GraphQLError("missing auth")

        // check if authorization token is present
        //const token = context.header.authorization!.replace(/bearer\s+/gi, "")
        const auth = await authHandler({ ctx: context })
        if (!auth.isAuthenticated) throw new GraphQLError("not authenticated")

        const uploadParameters: IUploadFileInput = {
            path: file.filepath,
            contentType: file.mimetype ?? "image/png"
        }

        // upload file to CloudFlare
        const uploadResponse = await uploadFile(uploadParameters)
        console.log(
            `uploadResponse: ${JSON.stringify(uploadResponse, null, 2)}`
        )
        if (uploadResponse.$metadata.httpStatusCode !== 200)
            throw new GraphQLError("upload failed")

        // Dynamically import getPlaiceholder
        const { getPlaiceholder } = await import("plaiceholder")

        const fileBuffer = await fs.readFile(file.filepath)

        const { metadata, base64 } = await getPlaiceholder(fileBuffer)

        // create an asset
        const asset = await AssetModel.create({
            owner: auth.user?.id,
            variants: [uploadResponse.url],
            originalFileName: file.originalFilename,
            key: uploadResponse.key,
            mimeType: file.mimetype,
            size: stats.size,
            blurhash: base64,
            height: metadata.height,
            width: metadata.width,
            lastReferenceCheckedAt: new Date()
        })

        // check if asset creation is successful
        if (!asset) throw new GraphQLError("asset creation failed")

        console.log(`Asset created: ${asset.id}`)
        console.log(`asset: ${JSON.stringify(asset, null, 2)}`)

        context.status = 200
        context.body = asset
    } catch (error: any | GraphQLError) {
        if (!(error instanceof GraphQLError)) console.log(error)
        // set status and error message in response body
        context.status = 400
        context.body = { success: false, message: error.message }
    } finally {
        // delete file from server after processing
        await fs.unlink(file.filepath)
    }
})

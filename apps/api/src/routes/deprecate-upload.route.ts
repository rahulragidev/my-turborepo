import KoaBody from "koa-body"
import Router from "@koa/router"
import fs from "fs/promises"
import { GraphQLError } from "libs/graphql-error"
//import { uploadFile } from "functions/s3"

import { AssetModel } from "entities/asset/asset.type"
import { authHandler } from "auth/auth-handler"
import { uploadToCloudflareImages } from "libs/cloudflare/upload-to-cloudflare-images"
import type { File } from "formidable"

// import { Context } from "koa"

const withBody = KoaBody({
    multipart: true,
    formidable: {
        multiples: false
    }
})

export const router = new Router({ prefix: "/api/upload/images" })

// router.use(cors())
// router.use(async (context, next) => {
//    context.res.setHeader('Access-Control-Request-Headers', '*')
//    context.res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
//    context.res.setHeader('Access-Control-Allow-Origin', '*') // TODO: restrict to only app url
//    context.res.setHeader('Access-Control-Allow-Headers', '*')
//    await next()
// })

// router.options('/', async context => {
//    context.status = 200
//    context.body = 'OK'
// })

// TODO: move this logic to GraphQL-upload
router.post("/", withBody, async context => {
    const file = context.request.files!.file as File
    console.log(
        `upload route has been hit with context headers: \n ${JSON.stringify(
            context.headers,
            null,
            2
        )}`
    )

    // get file size file
    const stats = await fs.stat(file.filepath)
    console.log(`file size: ${stats.size}`)

    try {
        //const { fileTypeFromFile } = await import("file-type")
        if (!context.header.authorization)
            throw new GraphQLError("missing auth")

        // check if authorization token is present
        //const token = context.header.authorization!.replace(/bearer\s+/gi, "")
        const auth = await authHandler({ ctx: context })
        if (!auth.isAuthenticated) throw new GraphQLError("not authenticated")

        // upload file to CloudFlare
        const uploadResponse = await uploadToCloudflareImages(file.filepath)
        console.log(
            `uploadResponse: ${JSON.stringify(uploadResponse, null, 2)}`
        )
        let asset

        if (uploadResponse?.success) {
            // Dynamically import getPlaiceholder
            const { getPlaiceholder } = await import("plaiceholder")
            // create a buffer to pass to plaiceholder
            const fileBuffer = await fs.readFile(file.filepath)

            const { metadata, base64 } = await getPlaiceholder(fileBuffer)

            // create new asset in the DB
            asset = await AssetModel.create({
                owner: auth.user?.id,
                cloudfareId: uploadResponse.result.id as string,
                originalFileName: uploadResponse.result.filename as string,
                variants: uploadResponse.result.variants,
                size: stats.size,
                //mimeType: file.mimetype as string,
                blurhash: base64, // should be blurhash.hash
                height: metadata.height, // should be blurhash.height
                width: metadata.width // should be blurhash.width
            })

            console.log(`Asset created: ${asset.id}`)
            console.log(`asset: ${JSON.stringify(asset, null, 2)}`)

            // set status and response body
            context.status = 200
            context.body = asset
        }

        context.status = uploadResponse.success
            ? 200 || uploadResponse.errors[0].code
            : 400
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

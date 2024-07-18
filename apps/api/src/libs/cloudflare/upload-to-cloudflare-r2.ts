import fs from "fs/promises"
import {
    DeleteObjectCommand,
    DeleteObjectCommandOutput,
    PutObjectCommand,
    PutObjectCommandOutput,
    S3Client
} from "@aws-sdk/client-s3"
import { cloudflareDefaultEndpoint, s3AccessKey, s3AccessKeyId } from "config"

const BUCKET_NAME = "images"

export interface IUploadFileInput {
    path: string
    contentType: string // Add contentType property to the interface
}

/**
 * uploads a file to Cloudflare R2
 *
 * @param path filepath
 * @returns file url
 */
export const uploadFile = async ({
    path,
    contentType // Add contentType parameter
}: IUploadFileInput): Promise<
    PutObjectCommandOutput & { key: string; url: string }
> => {
    try {
        console.log("uploading file to s3")

        // read the file from the path
        const fileContent = await fs.readFile(path)

        // Initialize S3 Client (Actually Cloudflare R2)
        const client = new S3Client({
            region: "auto",
            endpoint: cloudflareDefaultEndpoint,
            credentials: {
                accessKeyId: s3AccessKeyId,
                secretAccessKey: s3AccessKey
            }
        })

        // dynamically import nanoId
        const { nanoid } = await import("nanoid")
        const key = `${Date.now()}-${nanoid(6)}.${contentType.split("/")[1]}`

        // construct the command to PUT the file
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Body: fileContent,
            Key: key, // Set the Key property to
            ACL: "public-read",
            ContentType: contentType // Set the ContentType header
        })

        // send the command to Cloudflare R2
        const data = await client.send(command)

        // return the url of the uploaded object
        return {
            ...data,
            key,
            url: `https://images.onlokus.com/${key}`
        }
    } catch (error: any | unknown) {
        console.error(error)
        return error
    }
}

// deletes a file from Cloudflare R2
export const deleteFile = async (
    key: string
): Promise<DeleteObjectCommandOutput> => {
    const client = new S3Client({
        region: "auto",
        endpoint: cloudflareDefaultEndpoint,
        credentials: {
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3AccessKey
        }
    })

    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    })

    const response = await client.send(command)

    return response
}

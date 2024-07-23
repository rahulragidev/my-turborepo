import axios from "axios"

import { AssetModel } from "./asset.type"
import { AssetsResponse } from "./types/assets.response"
import { AuthRequestContext } from "auth/request-context"
import { GraphQLError } from "graphql"
import { ResponseSchema } from "types/response-schema.type"
import { deleteFile } from "libs/cloudflare/upload-to-cloudflare-r2"

export const deleteFromCloudflare = async (
    imageId: string
): Promise<ICloudFlareImageUploadResponse> => {
    console.log(`deleteFromCloudflare invoked: ${imageId}`)

    // URL
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID}/images/v1/${imageId}`

    const response = (await axios.delete(url, {
        headers: {
            Authorization: "Bearer eJb_FOIEBWrFWXt-Gy5sYozvktAeLUQh8392tRw0"
        }
    })) as { data: ICloudFlareImageUploadResponse }

    return response.data
}

export const allMyAssets = async (
    context: AuthRequestContext,
    userId?: string
): Promise<AssetsResponse> => {
    try {
        const owner = context?.user?.id || userId
        const assets = await AssetModel.find({ owner })
        return {
            assets,
            success: true,
            statusCode: 200,
            message: `${assets.length} assets found`
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            statusCode: 500 || error.statusCode,
            message: error
        }
    }
}

export const libraryUsage = async (
    context: AuthRequestContext,
    userId?: string
): Promise<number> => {
    let totalSize = 0
    try {
        const owner = context?.user?.id || userId
        const assets = await AssetModel.find({ owner })
        if (assets.length > 0) {
            for (let index = 0; index < assets.length; index++) {
                totalSize = totalSize + assets[index].size
            }
        }
        return totalSize
    } catch (error) {
        console.log(error)
        return totalSize
    }
}

export const deleteAsset = async (
    id: string,
    context: AuthRequestContext
): Promise<ResponseSchema> => {
    // 'id' is Model's ObjectId
    try {
        const asset = await AssetModel.findById(id)
        if (!asset) throw Error("Asset not found")

        if (asset.owner.toString() !== context.user!.id.toString())
            throw new GraphQLError(
                "You are not authorized to delete this asset"
            )

        // Delete from R2
        const deleteFileResponse = await deleteFile(asset.key!)
        // if delete has failed

        if (deleteFileResponse.$metadata.httpStatusCode !== 200)
            throw new GraphQLError(
                `deleteFile failed with response: ${deleteFileResponse.$metadata.httpStatusCode} \n requestId: ${deleteFileResponse.$metadata.requestId}`
            )

        // Delete from DB
        const deleteAsset = await AssetModel.findByIdAndDelete(id)
        if (!deleteAsset)
            throw new GraphQLError(
                "Bucket deletion is done, DB deletion failed"
            )

        return {
            success: true,
            statusCode: 200,
            message: `Asset deleted successfully`
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            statusCode: 500 || error.statusCode,
            message: error?.message as string
        }
    }
}

export const deleteAllUserAssets = async (
    context: AuthRequestContext
): Promise<ResponseSchema> => {
    try {
        const assets = await AssetModel.find({ owner: context?.user?.id })
        if (assets.length > 0) {
            for (let index = 0; index < assets.length; index++) {
                console.log("Commencing deletion of asset", assets[index].key)
                const deleteFileResponse = await deleteFile(assets[index].key!)
                if (deleteFileResponse.$metadata.httpStatusCode !== 200)
                    throw new GraphQLError(
                        `deleteFile failed with response: ${deleteFileResponse.$metadata.httpStatusCode} \n requestId: ${deleteFileResponse.$metadata.requestId}`
                    )

                console.log("deleted from bucket", assets[index].key)

                const deleteAsset = await AssetModel.findByIdAndDelete(
                    assets[index].id
                )
                if (!deleteAsset)
                    throw new GraphQLError(
                        `deletion failed on Asset for ${assets[index]._id}`
                    )
                console.log(
                    "deleted from Asset Instance on DB:",
                    assets[index]._id
                )
            }
            return {
                success: true,
                statusCode: 200,
                message: `All assets deleted successfully`
            }
        } else {
            return {
                success: true,
                statusCode: 200,
                message: `No assets found`
            }
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            statusCode: 500 || error.statusCode,
            message: error?.message as string
        }
    }
}

export const deleteAssets = async (
    ids: string[],
    context: AuthRequestContext
): Promise<ResponseSchema> => {
    let deleteCount = 0
    try {
        const assets = await AssetModel.find({
            _id: { $in: ids },
            owner: context.user!.id
        })
        if (assets.length > 0) {
            console.log("Assets found", assets.length)
            // delete each asset
            for (let index = 0; index < assets.length; index++) {
                if (
                    assets[index].owner.toString() !==
                    context.user!.id.toString()
                ) {
                    throw new GraphQLError(
                        `You are not authorized to delete this asset`
                    )
                }
                console.log("Commencing deletion of asset", assets[index].key)

                const deleteFromBucket = await deleteFile(assets[index].key!)
                if (deleteFromBucket.$metadata.httpStatusCode !== 200)
                    throw new GraphQLError(
                        `deletion failed on cloudflare for key ${assets[index].key}`
                    )
                console.log("deleted from cloudflare", assets[index].key)

                const deleteAsset = await AssetModel.findByIdAndDelete(
                    assets[index].id
                )
                if (!deleteAsset)
                    throw new GraphQLError(
                        `deletion failed on Asset for ${assets[index]._id}`
                    )

                console.log(
                    "deleted from Asset Instance on DB:",
                    assets[index]._id
                )
                deleteCount = deleteCount + 1
            }
            console.log("deleteCount", deleteCount)
            return {
                success: true,
                statusCode: 200,
                message: `${deleteCount} assets deleted successfully`
            }
        } else {
            return {
                success: true,
                statusCode: 200,
                message: `No assets found`
            }
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            statusCode: 500 || error.statusCode,
            message: `${error?.message}, deleted ${deleteCount}` as string
        }
    }
}

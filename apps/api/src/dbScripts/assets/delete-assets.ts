import { Asset, AssetModel } from "../../entities/asset/asset.type"
import { FilterQuery } from "mongoose"

export const deleteAssets = async (filter: FilterQuery<Asset>) => {
    try {
        const response = await AssetModel.deleteMany(filter)
        console.log("deleteAssets from DB:", response)
        return response
    } catch (error) {
        console.error("deleteAssets from DB:", error)
        return error
    }
}

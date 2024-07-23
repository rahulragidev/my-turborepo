import { AssetModel } from "entities/asset/asset.type"

export default async function reindexAssets() {
    try {
        // Get the current indexes from the AssetModel
        const currentIndexes = await AssetModel.listIndexes()
        console.log("Current indexes:", JSON.stringify(currentIndexes, null, 2))

        const syncIndexesResponse = await AssetModel.syncIndexes()
        console.log(
            "Synced Indexes:",
            JSON.stringify(syncIndexesResponse, null, 2)
        )

        console.log("Asset indexes reindexed successfully")
    } catch (error) {
        console.error("Error reindexing asset indexes:", error)
    }
}

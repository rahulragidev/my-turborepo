import { SiteModel } from "entities/site/site.type"

export default async function reindexSites() {
    try {
        // Get the current indexes from the SiteModel
        const currentIndexes = await SiteModel.listIndexes()
        console.log("Current indexes:", JSON.stringify(currentIndexes, null, 2))

        const syncIndexesResponse = await SiteModel.syncIndexes()
        console.log(
            "Synced Indexes:",
            JSON.stringify(syncIndexesResponse, null, 2)
        )

        console.log("Asset indexes reindexed successfully")
    } catch (error) {
        console.error("Error reindexing asset indexes:", error)
    }
}

import { SiteModel } from "entities/site/site.type"

const dropIndex = async () => {
    try {
        // Drop the unique index on the 'name' field
        await SiteModel.collection.dropIndex("name_1")

        console.log("Unique index on 'name' field dropped successfully.")
    } catch (error) {
        console.log("Error dropping unique index:", error)
    }
}

export default dropIndex

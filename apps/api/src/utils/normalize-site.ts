import unslugify from "./unslugify"
import { SiteModel } from "entities/site/site.type"

export const normalizeSiteNames = async () => {
    try {
        // Fetch all site records
        const sites = await SiteModel.find()
        console.log("found sites", sites.length)

        // Unslugify the site name and update the record
        for (const site of sites) {
            const unslugifiedName = unslugify(site.name!)
            console.log(
                "Updating site record:",
                site.name,
                "to",
                unslugifiedName
            )
            site.name = unslugifiedName
            await site.save()
        }

        console.log("All site records updated with unslugified names.")
    } catch (error) {
        console.log("Error updating site records:", error)
    }
}

export const addTextLogoNames = async () => {
    try {
        // Fetch all site records
        const sites = await SiteModel.find()
        console.log("found sites", sites.length)

        // Unslugify the site name and update the record
        for (const site of sites) {
            const logoName = site.name!.slice(0, 3).toUpperCase()
            console.log("Updating logoName of site:", site.name, "to", logoName)
            site.textLogo = logoName
            await site.save()
        }

        console.log("All site records updated with unslugified names.")
    } catch (error) {
        console.log("Error updating site records:", error)
    }
}

import generateUniqueSlug from "./generate-unique-slug"
import slugify from "./slugify"
import { SiteModel } from "../entities/site/site.type"

// Reuse the generateUniqueSlug function from the previous answer
const normalizeSlugs = async () => {
    try {
        // Fetch all site records without a slug
        const sitesWithoutSlug = await SiteModel.find({
            slug: { $exists: false }
        })

        // Generate a unique slug for each site record and update it
        for (const site of sitesWithoutSlug) {
            console.log("Updating site record:", site.name)
            const baseSlug = slugify(site.name!)
            console.log("Base slug:", baseSlug)
            const uniqueSlug = await generateUniqueSlug(baseSlug)
            console.log("Unique slug:", uniqueSlug)
            console.log("Unique slug:", baseSlug)
            // Site Slug
            site.slug = uniqueSlug
            await site.save()
        }

        console.log("All site records updated with a unique slug.")
    } catch (error) {
        console.log("Error updating site records:", error)
    }
}

export default normalizeSlugs

import { SiteModel } from "entities/site/site.type"

const generateUniqueSlug = async (slug: string): Promise<string> => {
    let newSlug = slug
    let count = 1

    const checkSlugExists = async (slugToCheck: string): Promise<boolean> => {
        const existingSite = await SiteModel.findOne({ slug: slugToCheck })
        return !!existingSite
    }

    while (await checkSlugExists(newSlug)) {
        newSlug = `${slug}-${count}`
        count++
    }

    return newSlug
}

export default generateUniqueSlug

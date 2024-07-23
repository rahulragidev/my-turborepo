/**
 * ==================================================
 * 🚨 🚨 🚨 🚨
 * WARNING
 * ADMIN ONLY APIs
 * DO NOT EXPOSE THESE TO THE PUBLIC
 * ==================================================
 */

import getProjectDomainsFromVercel from "libs/vercel/project/get-project-domains"

import { PageModel } from "entities/page/page.type"
import { SiteModel } from "entities/site/site.type"
import { logger } from "logger"
// import { Types } from "mongoose"

export const populateSiteDomains = async () => {
    try {
        const allSites = await SiteModel.find()
        for (const site of allSites) {
            if (site.vercelProjectId) {
                const vercelAPIResponse = await getProjectDomainsFromVercel(
                    site.vercelProjectId
                )
                if (vercelAPIResponse.error) {
                    logger.error(vercelAPIResponse.error)
                } else {
                    site.customDomain = vercelAPIResponse.domains
                    site.save()
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}

export const updateHeaderPagesForOldSites = async (): Promise<void> => {
    /**
     * 🚫 Discard
     * This is a one-time script to update the headerPages field for old sites.
     * WASTE WON'T WORK
     */
    try {
        console.log("Begin: updateHeaderPagesForOldSites")

        // Find sites without headerPages field
        const sitesWithoutHeaderPages = await SiteModel.find({
            headerPages: { $exists: false }
        })

        const pages = await PageModel.find({
            site: { $in: sitesWithoutHeaderPages.map(site => site._id) }
        })

        console.log(
            `Number of sites without headerPages: ${sitesWithoutHeaderPages.length}`
        )
        console.log("Sites", sitesWithoutHeaderPages, null, 2)

        // Prepare the bulk update operations
        const bulkUpdateOps = sitesWithoutHeaderPages.map(site => {
            const pageIds = pages.map(page => page._id)
            console.log(`pageIds: ${pageIds}`, null, 2)

            return {
                updateOne: {
                    filter: { _id: site._id },
                    update: { $push: { headerPages: { $each: pageIds } } }
                }
            }
        })

        // Execute the bulk update query
        // // @ts-expect-error because bulkWrite is not typed
        await SiteModel.bulkWrite(bulkUpdateOps)

        console.log("========================================")
        console.log("End: updateHeaderPagesForOldSites")
        console.log("========================================")
    } catch (error) {
        console.log("Error updating headerPages:", error)
    }
}

export const updateShowInHeaderForAllPages = async (): Promise<void> => {
    try {
        console.log("========================================")
        console.log("Begin: updateShowInHeaderForAllPages")
        console.log("========================================")
        const pages = await PageModel.find()

        const bulkUpdateOps = pages.map(page => {
            return {
                updateOne: {
                    filter: { _id: page._id },
                    update: { $set: { showInHeader: true } }
                }
            }
        }, [])

        await PageModel.bulkWrite(bulkUpdateOps)

        console.log("========================================")
        console.log(`Response`, bulkUpdateOps, null, 2)
        console.log("End: updateShowInHeaderForAllPages")
        console.log("========================================")
    } catch (error) {
        console.log("Error updating showInHeader:", error)
    }
}

export const getSiteCount = async ({
    templateId
}: {
    templateId: string
}): Promise<number> => {
    try {
        const count = await SiteModel.countDocuments({ template: templateId })
        console.log(
            `There are ${count} sites with the templateId: ${templateId}`
        )
        return count
    } catch (error) {
        console.error(error)
        return 0
    }
}

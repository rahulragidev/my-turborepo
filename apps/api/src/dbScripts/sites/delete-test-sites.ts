import { GraphQLError } from "graphql"
import { PageModel } from "entities/page/page.type"
import { SiteModel } from "entities/site/site.type"
import { Types } from "mongoose"
import { deleteProject } from "libs/vercel"

export const deleteAllTestSites = async (): Promise<void> => {
    const sites = await SiteModel.find()

    // an array of test sites
    const testSites = sites.filter(site =>
        site.slug.toLowerCase().includes("test")
    )

    console.log(`Test sites: ${JSON.stringify(testSites, null, 2)} `)

    //  create an array of promises where the site name contains test
    const promises = testSites.map(async site => {
        const deleted = await SiteModel.deleteOne({ _id: site.id })

        if (!deleted.acknowledged) throw new GraphQLError("Error deleting site")
        // We need to delete all the Site's pages as well.
        const deletedSitePages = await PageModel.deleteMany({
            site: new Types.ObjectId(site.id)
        })
        console.log(
            `Deleted site acknowledge: ${deletedSitePages.acknowledged}`
        )
        console.log(
            `Deleted site pages count: ${deletedSitePages.deletedCount}`
        )

        if (site.vercelProjectId) {
            const vercelProject = await deleteProject(
                site?.vercelProjectId as string
            )
            if (!vercelProject.success)
                throw new GraphQLError(
                    `Vercel Project delete failed: ${vercelProject.message}`
                )

            console.log(
                `vercelProjectDelete Response: ${JSON.stringify(
                    vercelProject,
                    null,
                    2
                )}`
            )
        }
    })

    //  wait for all promises to resolve
    await Promise.all(promises)
}

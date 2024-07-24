import fs from "fs"

import getStripeSubscriptionByEmail from "libs/stripe/get-stripe-subscription-by-email"
import path from "path"
import string from "string-sanitizer"
import { AuthRequestContext } from "auth/request-context"
import { GraphQLError } from "graphql"
import { Page, PageModel } from "./page.type"
import { PageFilterEnum } from "./types/page-filter.enum"
import { PageResponse } from "./types/page.response"
import { PagesResponse } from "./types/pages.response"
import { ResponseSchema } from "types/response-schema.type"
import { SiteModel } from "entities/site/site.type"
import { Types } from "mongoose"
import { UpdatePageInput } from "./types/update-page-input"
import { UpdatePagesPriorityInput } from "./types/update-pages-priority.input"
import { logger } from "logger"
import { revalidationSecretKey } from "config"

export async function revalidatePageSlug(page: Page) {
    try {
        const site = await SiteModel.findById(page.site._id)

        if (!site) throw new GraphQLError("Site not found")
        if (!site.primaryDomain)
            throw new GraphQLError("Site does not have a primary domain")

        const response = await fetch(
            `https://${site.primaryDomain}/api/revalidate/${page.slug}`,
            {
                method: "POST",
                headers: {
                    "X-Revalidation-Key": revalidationSecretKey
                }
            }
        )

        if (!response.ok) {
            const data = await (response.json() as Promise<{
                message: string
                ok: boolean
            }>)

            throw new Error(data.message)
        }

        const data = await response.json()

        return {
            success: data.ok,
            message: data.message
        }
    } catch (error) {
        logger.error(error, `Error in revalidating page ${page.slug}`)

        return {
            success: false,
            message: (error as Error).message
        }
    }
}

export const getRootPage = async (siteId: string): Promise<PageResponse> => {
    try {
        const rootPage = await PageModel.findOne({
            site: siteId,
            name: "root"
        })
        if (!rootPage) throw new GraphQLError("Root page not found")
        return {
            success: true,
            message: "Root page found",
            data: rootPage
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.message
        }
    }
}

// Get all Pages by site
export const getAllPagesBySite = async (
    siteId: string,
    filter: PageFilterEnum = PageFilterEnum.ANY
): Promise<PagesResponse> => {
    try {
        const payload: Partial<Page> = {
            site: new Types.ObjectId(siteId)
        }

        if (filter === PageFilterEnum.PRIVATE) {
            payload.isPublic = false
        } else if (filter === PageFilterEnum.PUBLIC) {
            payload.isPublic = true
        }

        const pages = await PageModel.find(payload)
        return {
            success: true,
            message: `${pages.length} pages found`,
            data: pages
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.message
        }
    }
}

// Get All Orphan Pages by site
export const getAllOrphanPagesBySite = async (
    siteId: string,
    filter: PageFilterEnum = PageFilterEnum.ANY
): Promise<PagesResponse> => {
    try {
        let filterPayload: Partial<Page> = {
            site: new Types.ObjectId(siteId),
            parent: null,
            isPublic: true
        }

        switch (filter) {
            case PageFilterEnum.PRIVATE:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    parent: null,
                    isPublic: false
                }
                break
            case PageFilterEnum.PUBLIC:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    parent: null,
                    isPublic: true
                }
                break
            case PageFilterEnum.ANY:
                delete filterPayload.isPublic
                break
            default:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    parent: null,
                    isPublic: true
                }
                break
        }

        const pages = await PageModel.find(filterPayload).sort({ priority: 1 })
        return {
            success: true,
            message: `${pages.length} pages found`,
            data: pages
        }
    } catch (error: any) {
        logger.error(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const getFeaturedPagesBySite = async (
    siteId: string,
    filter: PageFilterEnum = PageFilterEnum.ANY
): Promise<PagesResponse> => {
    try {
        let filterPayload: Partial<Page> = {
            site: new Types.ObjectId(siteId),
            isFeatured: true
        }

        switch (filter) {
            case PageFilterEnum.PRIVATE:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    isFeatured: true,
                    isPublic: false
                }
                break
            case PageFilterEnum.PUBLIC:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    isFeatured: true,
                    isPublic: true
                }
                break
            case PageFilterEnum.ANY:
                delete filterPayload.isPublic
                break
            default:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    isFeatured: true,
                    isPublic: true
                }
                break
        }

        const pages = await PageModel.find(filterPayload).sort({ priority: 1 })
        return {
            success: true,
            message: ` found ${pages.length} featured pages`,
            data: pages
        }
    } catch (error: any) {
        logger.error(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const getPageBySlug = async (
    siteId: string,
    slug: string,
    filter?: PageFilterEnum
): Promise<PageResponse> => {
    // No Filter is assumed as public
    try {
        let filterPayload: Partial<Page> = {
            site: new Types.ObjectId(siteId),
            slug,
            isPublic: true
        }

        switch (filter) {
            case PageFilterEnum.PRIVATE:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    slug,
                    isPublic: false
                }
                break
            case PageFilterEnum.PUBLIC:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    slug,
                    isPublic: true
                }
                break
            case PageFilterEnum.ANY:
                delete filterPayload.isPublic
                break
            default:
                filterPayload = {
                    site: new Types.ObjectId(siteId),
                    slug,
                    isPublic: true
                }
                break
        }

        const response = await PageModel.findOne(filterPayload)

        if (!response) {
            const error = new Error()
            error.message = "Page not found"
            throw error
        }

        return {
            success: true,
            message: "Page fetched successfully",
            statusCode: 200,
            data: response!
        }
    } catch (error: GraphQLError | any) {
        logger.log(error)
        if (error.message === "Page not found") {
            return {
                success: false,
                message: error.message,
                statusCode: 404
            }
        }
        return {
            success: false,
            message: error.message,
            statusCode: 500
        }
    }
}

export const getPage = async (id: string): Promise<PageResponse> => {
    try {
        const page = await PageModel.findById(id)
        if (!page) throw new GraphQLError("Not found")

        return {
            success: true,
            message: "Page found",
            data: page
        }
    } catch (error: any) {
        logger.log(error)

        return {
            success: false,
            message: `Failed! ${error.message}`
        }
    }
}

export const createPage = async (
    context: AuthRequestContext,
    siteId: string,
    name: string,
    parent?: string
): Promise<PageResponse> => {
    try {
        logger.debug({ siteId, name, parent }, "Creating page")

        if (name.length < 3)
            throw new GraphQLError("Name must be at least 3 characters long")

        if (
            name === "root" ||
            string.sanitize(name).toLocaleLowerCase() === "root"
        )
            throw new GraphQLError("Name cannot be root")

        if (string.sanitize(name).toLocaleLowerCase() === "index")
            throw new GraphQLError("Name cannot be index")

        // const parentPage = await PageModel.findById(parent)

        // Paywall check
        // check if subscription
        // if subscription is not active, count pages for site.
        // if page.count > 3, throw error

        const userSubscription = await getStripeSubscriptionByEmail(
            context.user!.email
        )

        if (!userSubscription || userSubscription.status !== "active") {
            const totalPageCount = await PageModel.countDocuments({
                site: siteId
            })
            if (totalPageCount > 3) {
                throw new GraphQLError(
                    "Limit reached. Please subscribe to create more pages."
                )
            }
        }

        // Check if site exists
        const site = SiteModel.findById(siteId)
        if (!site) throw new GraphQLError(`No site found with id: ${siteId}`)

        let finalParent
        // initialRootPage
        let rootPage

        if (parent) {
            // if parent is passed in the params, assign finalParent to parent
            finalParent = new Types.ObjectId(parent)
        } else {
            // find rootPage
            rootPage = await PageModel.findOne({
                name: "root",
                site: new Types.ObjectId(siteId)
            }).lean()

            // if no rootPage exists, createOne (Done for backwards compatibility reasons on Date: 2023-Dec-12)
            // all sites created after this date will have a root page by default
            if (!rootPage) {
                rootPage = await PageModel.create({
                    site: siteId,
                    name: "root",
                    slug: `root_${siteId}`,
                    owner: new Types.ObjectId(context.user!.id),
                    body: "",
                    draftBody: "",
                    priority: 0,
                    isPublic: true
                })
                throw new GraphQLError("Root page not found")
            }

            // after fetching or creating a rootPage, assign finalParent to rootPage._id
            finalParent = rootPage._id
        }

        const priority = await PageModel.countDocuments({
            site: new Types.ObjectId(siteId),
            parent: parent ? new Types.ObjectId(parent) : null
        })

        // create a slug for the new page.
        const slug = `${string.sanitize.addDash(name).toLocaleLowerCase()}`

        // find pages with same slug or slug-number pattern
        const existingPages = await PageModel.find({
            site: new Types.ObjectId(siteId),
            slug: { $regex: `^${slug}(-\\d+)?$`, $options: "gi" }
        }).lean()

        const regex = new RegExp(`^${slug}(-[0-9]+)?$`, "gi")
        const duplicatePages = existingPages.filter(
            page => regex.test(page.slug) || page.slug === slug
        )

        const newSlug =
            duplicatePages.length > 0
                ? `${slug}-${duplicatePages.length}` // array length is always +1
                : slug

        const pageInput: Partial<Page> = {
            site: new Types.ObjectId(siteId),
            name: name as string,
            slug: newSlug,
            body: "",
            priority,
            isPublic: false,
            draftBody: "",
            owner: new Types.ObjectId(context.user!.id)
        }

        // Check if the owner of the parent is the same as the context user
        if (finalParent) {
            // this block is trying to preventing assigning a parent that is not of the current user's.
            const parentPage = await PageModel.findById(finalParent)
            if (!parentPage) throw new GraphQLError("Parent page not found")
            if (parentPage?.owner?.toString() !== context?.user?.id) {
                throw new GraphQLError(
                    "You are not the owner of the parent page"
                )
            }
            pageInput.parent = new Types.ObjectId(finalParent)
        }

        const newPage = await PageModel.create(pageInput)

        return {
            data: newPage,
            success: true,
            message: "Page created successfully"
        }
    } catch (error: any) {
        logger.log(error)

        return {
            success: false,
            message: `Create Page Failed! \n ${error}`
        }
    }
}

export const updatePage = async (
    id: string,
    data: UpdatePageInput,
    context: AuthRequestContext
): Promise<PageResponse> => {
    try {
        if (data.name === "root") throw new GraphQLError("Name cannot be root")

        if (data.slug === "root") throw new GraphQLError("Slug cannot be root")

        // Fetch page
        const page = await PageModel.findById(id)

        // Check if page is available and also if the owner and the user are same
        if (!page) throw new GraphQLError("not found")
        if (page.owner?.toString() !== context.user?.id.toString())
            throw new GraphQLError("Not your page to edit")

        if (page.slug === "index" || page.slug === "root") {
            if (data.isFeatured === true) {
                throw new GraphQLError(
                    "index and root pages cannot be featured"
                )
            }
        }

        // Update Page
        const updatedPage = await PageModel.findByIdAndUpdate(id, data, {
            new: true
        })

        if (!updatedPage) {
            throw new GraphQLError("Failed to update page")
        }

        return {
            success: true,
            message: "Page updated successfully!",
            data: updatedPage
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const deletePage = async (
    id: string,
    context: AuthRequestContext
): Promise<PageResponse> => {
    try {
        // Fetch page
        const page = await PageModel.findById(id)

        // Check if page is available and also if the owner and the user are same
        if (!page) throw new GraphQLError("not found")
        if (page!.owner!.toString() !== context.user!.id.toString())
            throw new GraphQLError("Not your page to delete")

        switch (page.slug) {
            case "index":
                throw new GraphQLError("Cannot delete index page")
            case "home":
                throw new GraphQLError("Cannot delete home page")
            case "root":
                throw new GraphQLError("Cannot delete root page")
            default:
                break
        }

        // Delete Page
        await PageModel.findByIdAndDelete(id)

        return {
            success: true,
            message: "Page deleted successfully!"
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const getPageChildren = async (pageId: string): Promise<Page[]> => {
    try {
        const page = await PageModel.findById(pageId)
        if (!page) throw new GraphQLError("Not found")
        // get children page
        const children = await PageModel.find({ parent: page._id })
        return children
    } catch (error: any) {
        logger.log(error)

        return []
    }
}

export const removeParent_deprecated = async (
    context: AuthRequestContext,
    pageId: string
): Promise<PageResponse> => {
    /**
     * DEPRECATED
     * Shouldn't be used anymore
     */
    try {
        // Fetching the page
        const page = await PageModel.findById(pageId)
        if (!page) throw new GraphQLError("Not found")

        // verify if the user is the owner of the page
        if (page!.owner?.toString() !== context.user!.id.toString())
            throw new GraphQLError("Not your page")

        // Make the page orphan; remove parent
        const updatedPage = await PageModel.findByIdAndUpdate(pageId, {
            parent: null
        })

        return {
            success: true,
            message: "Page is now orphan",
            data: updatedPage!
        }
    } catch (error: any) {
        logger.log(error)
        return {
            success: false,
            message: error.message
        }
    }
}

export const assignParent = async (
    context: AuthRequestContext,
    pageId: string,
    parentId: string
): Promise<PageResponse> => {
    try {
        // Fetching the page
        const child = await PageModel.findById(pageId)

        if (!child) throw new GraphQLError("Not found")
        // verify if the user is the owner of the page
        if (child!.owner?.toString() !== context.user!.id.toString())
            throw new GraphQLError("Not your page")

        // Fetching the parent page
        const parent = await PageModel.findById(parentId)
        if (!parent) throw new GraphQLError("Parent not found")

        // verify if the user is the owner of the parent page
        if (parent!.owner?.toString() !== context.user!.id.toString())
            throw new GraphQLError("Not your parent page")

        //// check if parent page is Index
        //if (parent.slug === "index")
        //    throw new GraphQLError("Cannot assign page to index")

        // A child cannot be it's parent's parent
        if (parent.toString() === child.parent?.toString())
            throw new GraphQLError("Page cannot be it's parent's parent")

        if (child.parent?.toString() === pageId)
            throw new GraphQLError("Parent cannot be a child of it's child")

        // checking if page itself is a parent
        const existingChildrenForChild = await PageModel.find({
            parent: child._id
        })

        if (existingChildrenForChild.length > 0)
            throw new GraphQLError(
                `Page is already a parent for ${existingChildrenForChild.length} pages`
            )

        // assign parent to page
        const updatedPage = await PageModel.findByIdAndUpdate(child._id, {
            parent: new Types.ObjectId(parentId)
        })

        return {
            success: true,
            message: "Page assigned to parent successfully",
            data: updatedPage!
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const publishPage = async (
    id: string,
    context: AuthRequestContext
): Promise<PageResponse> => {
    try {
        const page = await PageModel.findById(id)
        if (!page) throw new GraphQLError("Not found")
        if (page.owner?.toString() !== context.user?.id.toString())
            throw new GraphQLError("Not your page")
        if (!page.jsonDraftBody)
            throw new GraphQLError("No json draft body to publish")

        // publish page
        const newPage = await PageModel.findByIdAndUpdate(
            id,
            {
                body: page.draftBody,
                jsonBody: page.jsonDraftBody,
                lastPublishedAt: new Date(),
                isPublic: true
            },
            { new: true }
        )

        if (!newPage) throw new GraphQLError("Failed to publish page")

        await revalidatePageSlug(newPage)

        return {
            success: true,
            message: "Page published successfully",
            data: newPage
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : (error as string)
        }
    }
}

export const updatePagePriority_deprecated = async (
    context: AuthRequestContext,
    pageId: string,
    newPriority: number
): Promise<PagesResponse> => {
    try {
        // Find the page
        const page = await PageModel.findById(pageId)
        if (!page) {
            throw new Error("Page not found")
        }
        if (page.owner?.toString() !== context.user?.id.toString()) {
            throw new Error("Not your page")
        }

        const currentPriority = page.priority
        if (currentPriority === newPriority) {
            throw new Error("No changes made")
        }

        // Find all pages with same parent and site
        const allPages = await PageModel.find({
            site: page.site,
            parent: page.parent
        })
        // loop through allPages and increment/decrement priority of all pages with priority
        // greater than newPriority and less than currentPriority
        // And later update the page priority with newPriority
        let query: any = {}
        query =
            newPriority < currentPriority
                ? { $inc: { priority: 1 } }
                : { $inc: { priority: -1 } }

        await PageModel.updateMany(
            {
                site: page.site,
                parent: page.parent,
                priority: {
                    $gte: Math.min(newPriority, currentPriority),
                    $lte: Math.max(newPriority, currentPriority)
                }
            },
            query
        )
        page.priority = newPriority
        await page.save()
        return {
            success: true,
            message: "Page priority updated successfully",
            data: allPages
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const updateSitePagesPriority = async (
    context: AuthRequestContext,
    data: UpdatePagesPriorityInput
): Promise<ResponseSchema> => {
    try {
        // Create an array of queries from and bulkwrite them
        const updateQuery = data.pagesList.map(({ id, priority }) => ({
            updateOne: {
                filter: {
                    _id: new Types.ObjectId(id),
                    owner: new Types.ObjectId(context.user!.id)
                },
                update: { priority }
            }
        }))
        const bulkWriteResponse = await PageModel.bulkWrite(updateQuery)
        if (bulkWriteResponse.isOk()) {
            return {
                success: true,
                message: "Site pages priority updated successfully"
            }
        }
        throw new Error(bulkWriteResponse.getWriteErrors()[0]!.errmsg)
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

/**
 * ========================
 * CAUTION!!
 * ADMIN FUNCTIONS, NOT FOR PUBLIC USE
 * ========================
 */

export async function PagesPriorityNormalization() {
    // Get all pages
    const allPages = await PageModel.find({}).sort({ createdAt: 1 }).exec()

    // Create an array of pages with same parent and site
    const pagesByParent = allPages.reduce((accumulator: any, page: any) => {
        const key = `${page.parent}-${page.site}`
        if (!accumulator[key]) {
            accumulator[key] = []
        }
        accumulator[key].push(page)
        return accumulator
    }, {})

    // DEBUG: write pagebyparent to a local json file
    fs.writeFileSync(
        // Users/praneethpike/Work/projects/lokus/lokus-api/dist/entities/page/pagesByParent.json
        // output path file to Users/praneethpike/Work/projects/lokus/
        path.join(`${__dirname.slice(0, 39)}/pagesByParent.json`),
        JSON.stringify(pagesByParent, null, 2)
    )

    // for every object in pagesByParent, push to updateQuery an object with updateOne
    // and filter and update
    const updateQuery: any = []
    for (const key in pagesByParent) {
        const pages = pagesByParent[key]
        pages.forEach((page: any, index: number) => {
            updateQuery.push({
                updateOne: {
                    filter: { _id: page._id },
                    update: { $set: { priority: index } }
                }
            })
        })
    }

    // let updateQuery: any = []
    // for (const key in pagesByParent) {
    //     const pages = pagesByParent[key]
    //     updateQuery = pages.map((page: any, index: number) => ({
    //         updateOne: {
    //             filter: { _id: page._id },
    //             update: { $set: { priority: index } }
    //         }
    //     }))
    // }

    fs.writeFileSync(
        // Users/praneethpike/Work/projects/lokus/lokus-api/dist/entities/page/pagesByParent.json
        // output path file to Users/praneethpike/Work/projects/lokus/
        path.join(`${__dirname.slice(0, 39)}/updateQuery.json`),
        JSON.stringify(updateQuery, null, 2)
    )

    await PageModel.bulkWrite(updateQuery)
}

export async function rootPageNormalization() {
    try {
        // Get all pages in the DB.
        const allPages = await PageModel.find({}).sort({ createdAt: 1 }).exec()

        for (const page of allPages) {
            if (page.parent === null) {
                if (page.name !== "root") {
                    // Check if rootPage exists for site
                    const rootPage = await PageModel.findOne({
                        site: page.site,
                        name: "root"
                    }).exec()

                    if (rootPage) {
                        page.parent = rootPage._id
                    } else {
                        // Create a rootPage if it doesn't exist
                        const newRootPage = new PageModel({
                            name: "root",
                            slug: `root_${page.site}`,
                            site: page.site,
                            body: "",
                            owner: page.owner
                        })
                        await newRootPage.save()
                        page.parent = newRootPage._id
                    }
                } else {
                    logger.warn(`Page ${page._id} is a root page. Skipping.`)
                }
            } else {
                logger.warn(`Page ${page._id} already has a parent. Skipping.`)
            }

            try {
                await page.save()
            } catch (saveError) {
                logger.error(`Error saving page ${page._id}:`, saveError)
                logger.error(`Error occurred on page data:`, page)
            }
        }

        logger.log("All pages have been processed and updated if necessary.")
    } catch (error) {
        logger.error("Error normalizing pages:", error)
    }
}

export const countAllRootPagesAndChildren = async () => {
    try {
        const allRootPages = await PageModel.find(
            { parent: null },
            "_id"
        ).exec() // Only retrieve _id

        await Promise.all(
            allRootPages.map(async rootPage => {
                const childrenCount = await PageModel.countDocuments({
                    parent: rootPage._id
                })
                return {
                    rootPageId: rootPage._id,
                    childrenCount
                }
            })
        )
    } catch (error) {
        logger.error("Error in counting root pages and children:", error)
    }
}

export const getAllSitesAndRootPages = async () => {
    try {
        const allSites = await SiteModel.find()

        for (const site of allSites) {
            await PageModel.find({
                site: site._id,
                //parent: null,
                name: "root"
            }).select("_id name") // Select only the id and name fields
        }
    } catch (error) {
        logger.error("Error in retrieving all sites and root pages:", error)
    }
}

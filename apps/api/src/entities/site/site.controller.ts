import { AuthRequestContext } from "auth/request-context"
import { PageModel } from "../../entities/page/page.type"
// import { SubscriptionModel } from "../../entities/subscription/subscription.type"
import { GraphQLError } from "graphql"
import { UserModel } from "../../entities/user/user.type"
// import CreateVirtualHost from "functions/create-virtual-host"
import {
    CreateProject,
    CreateProjectEnvironment,
    deleteProject,
    getProject, // updateProjectDomainVercel
    setProjectFramework
} from "libs/vercel"
// import { DateTime } from "luxon"
import addDomainToProjectVercel from "libs/vercel/domain/add-domain-to-project"
import createDeployment from "libs/vercel/deployment/create-deployment"
import getProjectDomainsFromVercel from "libs/vercel/project/get-project-domains"
import getStripeSubscriptionByEmail from "libs/stripe/get-stripe-subscription-by-email"
import slugify from "utils/slugify"

import checkDomainConfiguration from "libs/vercel/domain/check-domain-configuration"
import generateUniqueSlug from "utils/generate-unique-slug"
import removeDomainFromProjectVercel from "libs/vercel/domain/remove-domain-from-project"
import verifyProjectDomainVercel from "libs/vercel/project/verify-project-domain"
import { AssetModel } from "../../entities/asset/asset.type"
import { ChangeSiteTemplateResponse } from "./types/change-site-templates.response"
import { CreateSiteResponse } from "./types/create-site.response"
import { DeploySiteResponse } from "./types/deploy-response"
import { DomainConfigurationInterface } from "../../entities/domain/types/domain-configuration-response.type"
import { FrameworkEnum } from "../../entities/template/types/framework.enum"
import { PageResponse } from "../../entities/page/types/page.response"
import { ResponseSchema } from "types/response-schema.type"
import { Site, SiteModel } from "./site.type"
import { SiteDomainsResponse } from "./types/site-domains.response"
import { SiteInput } from "./types/site.input"
import { SiteResponse } from "./types/site.response"
import { SiteStatusResponse } from "./types/site-status.response"
import { SitesResponse } from "./types/sites.response"
import { TemplateModel } from "../../entities/template/template.type"
import { Types } from "mongoose"
import { UpdateSiteInput } from "./types/update-site.input"
import { VercelProjectDomain } from "./types/vercel-domain.response"
import { logger } from "logger"
import { publicGraphQlEndpoint, publicSiteDomain } from "config"
import { reservedNames } from "utils/reserved-names"

export const getAllMySites = async (
    context: AuthRequestContext
): Promise<SitesResponse> => {
    try {
        const mySites = await SiteModel.find({
            owner: new Types.ObjectId(context?.user?.id)
        })

        return {
            success: true,
            message: "mySites found",
            data: mySites
        }
    } catch (error) {
        logger.error({ error }, "Error at mySites resolver")
        return {
            success: false,
            message: error as string
        }
    }
}

export const getMySiteById = async (
    id: string,
    context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        if (!context.write) throw new GraphQLError("Private Site")
        const response = (await SiteModel.findById(id)) as Site

        if (response.owner?.toString() !== context.user!.id)
            throw new GraphQLError("You don't own this site!")

        return {
            success: true,
            message: "Site fetched successfully",
            data: response
        }
    } catch (error) {
        return {
            success: false,
            message: error as string
        }
    }
}

export const getSiteById = async (id: string): Promise<SiteResponse> => {
    try {
        const site = await SiteModel.findById(id)
        if (!site) throw new GraphQLError("Site not found")
        return {
            success: true,
            message: "Fetched site successfully",
            data: site!
        }
    } catch (error: any) {
        return {
            success: false,
            message: error
        }
    }
}

// Update Site
export const updateSite = async (
    id: string,
    data: UpdateSiteInput,
    context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        //if (!context.write) throw new GraphQLError("Unauthorized to write!")
        const site = await SiteModel.findById(id)
        if (!site) throw new GraphQLError("No Site found")
        if (site!.owner!.toString() !== context.user!.id.toString())
            throw new GraphQLError("Not your site to update!")
        // Update if all is well
        const updatedSite = await SiteModel.findByIdAndUpdate(id, data, {
            new: true
        })

        return {
            success: true,
            message: "Site updated successfully",
            data: updatedSite!
        }
    } catch (error) {
        logger.error(error)

        return {
            success: false,
            message: error as string
        }
    }
}

// Delete Site
export const deleteSite = async (
    id: string,
    _context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        const site = await SiteModel.findById(id)
        if (!site) throw new GraphQLError("No Site found")
        //if (site!.owner!.toString() !== context.user!.id || context.isApiKey)
        //    throw new GraphQLError("Not your site to delete!")

        const deleted = await SiteModel.findByIdAndDelete(id)
        if (!deleted) throw new GraphQLError("Error deleting site")

        // We need to delete all the Site's pages as well.
        if (deleted.vercelProjectId) {
            const vercelProject = await deleteProject(
                deleted?.vercelProjectId as string
            )
            if (!vercelProject.success)
                throw new GraphQLError(
                    `Vercel Project delete failed: ${vercelProject.message}`
                )
        }
        return {
            success: true,
            message: "Site Deleted successfully"
        }
    } catch (error: any | GraphQLError) {
        logger.error(error)

        return {
            success: false,
            message: error.message as string
        }
    }
}

export const createRootPageForSite = async (
    siteId: string,
    siteName: string,
    context: AuthRequestContext
): Promise<PageResponse> => {
    try {
        // 1. Create a root page for the site
        const rootPage = await PageModel.create({
            site: siteId,
            name: "root",
            slug: `root-${siteId}`,
            owner: new Types.ObjectId(context.user!.id),
            body: "",
            draftBody: "",
            priority: 0,
            isPublic: true
        })

        // 2. Create an index page for the site with the root page as parent
        const indexPage = await PageModel.create({
            site: siteId,
            name: siteName,
            slug: "index",
            owner: new Types.ObjectId(context.user!.id),
            metaTitle: siteName,
            body: "",
            draftBody: "",
            priority: 0,
            isPublic: true,
            parent: rootPage.id
        })

        return {
            success: true,
            message: "Index page created successfully",
            data: indexPage
        }
    } catch (error: any) {
        logger.error(`🚫 Error on createIndexPageForSite: \n ${error}`)

        return {
            success: false,
            message: error.message || "Error creating index page"
        }
    }
}

// Create Site
export const createSite = async (
    data: SiteInput,
    context: AuthRequestContext
): Promise<CreateSiteResponse> => {
    const status: CreateSiteResponse = {
        siteCreated: false,
        vercelProjectCreated: false,
        pageCreated: false,
        frameWorkSet: false,
        envsAdded: false,
        subdomainAdded: false,
        siteUpdatedWithVercelProjectId: false,
        message: "",
        data: null
    }

    try {
        logger.log(`👉 Create site called with Context`)
        logger.log(`Ctx: ${JSON.stringify(context, null, 2)}`)
        logger.debug(data, "👉 Create site called with data")

        const user = await UserModel.findById(context.user!.id)

        if (!user) throw new GraphQLError("User not found")
        logger.log(`👉 Fetched User: ${user?.email}`)

        if (reservedNames.includes(data.slug))
            throw new GraphQLError(`slug ${data.slug} is reserved`)

        // paywall check: allow only 1 site for non-subscribers
        const userSubscription = await getStripeSubscriptionByEmail(user.email)

        if (!userSubscription || userSubscription.status !== "active") {
            const currentSitesCount = await SiteModel.countDocuments({
                owner: user.id
            })
            if (currentSitesCount > 0) {
                throw new GraphQLError(
                    "You need to subscribe to create more sites"
                )
            }
        }

        const { slug, templateId } = data
        if (!slug) throw new GraphQLError("Missing slug")
        if (!templateId) throw new GraphQLError("Missing templateId")

        const finalSlug = await generateUniqueSlug(slugify(slug))

        // constructing the payload
        const payload = {
            slug:
                process.env.NODE_ENV !== "production"
                    ? `${process.env.NODE_ENV}-${finalSlug}`
                    : finalSlug,
            owner: new Types.ObjectId(context.user!.id),
            template: new Types.ObjectId(templateId)
        }

        logger.debug(payload, "👉 Site Payload")

        const newSite = await SiteModel.create(payload)
        if (!newSite) throw new GraphQLError("Error creating site")

        status.siteCreated = true
        logger.log(`Site created on DB: ${JSON.stringify(newSite, null, 2)}`)

        const [indexPage, vercelProject] = await Promise.all([
            createRootPageForSite(newSite.id, newSite.name, context),
            CreateProject(newSite.slug!)
        ])

        status.pageCreated = indexPage.success

        if ("error" in vercelProject) {
            status.message = `Site partially created, but hosting Project creation failed: ${vercelProject.error.message}`
            return status
        }

        status.vercelProjectCreated = true

        const updatedSite = (await SiteModel.findByIdAndUpdate(
            newSite._id,
            {
                vercelProjectId: vercelProject.id
            },
            { new: true }
        )) as Site

        if (updatedSite) {
            status.siteUpdatedWithVercelProjectId = true
        }

        status.data = updatedSite

        const [setFramework, addEnvironmentToVercelProject] = await Promise.all(
            [
                setProjectFramework(vercelProject.id),
                CreateProjectEnvironment(vercelProject.id, newSite.id)
            ]
        )

        status.frameWorkSet = !!setFramework
        status.envsAdded = !!addEnvironmentToVercelProject

        if (updatedSite.vercelProjectId) {
            const addLokusSubDomain = await addDomainToProjectVercel(
                updatedSite.vercelProjectId,
                `${updatedSite.slug}.${publicSiteDomain}`
            )
            if (addLokusSubDomain.error) {
                status.message += `\nSubdomain adding failed: ${addLokusSubDomain.error.message}`
            } else {
                status.subdomainAdded = true
                logger.log(`👉 Subdomain created: ${addLokusSubDomain}`)
            }

            // after adding subdomain assign the customDomain as site-slug.${publicSiteDomain}
            const updateSiteWithDomain = await SiteModel.findByIdAndUpdate(
                updatedSite.id,
                {
                    primaryDomain: `${updatedSite.slug}.${publicSiteDomain}`
                },
                { new: true }
            )

            if (updateSiteWithDomain?.errors) {
                status.message += `\nSite's primaryDomain update failed: ${updateSiteWithDomain.errors}`
            }
            logger.log(
                `👉 Subdomain marked as primaryDomain: ${addLokusSubDomain}`
            )
        }

        logger.log(`👉 Framework set: ${setFramework}`)
        logger.log(`👉 Env Added finished: ${addEnvironmentToVercelProject}`)
        if (!status.message) {
            status.message = "🎉 Site fully created!"
        }
        return status
    } catch (error: GraphQLError | any) {
        logger.error(`Error: ${error.message}`)
        status.message = "Site creation encountered errors"
        return status
    }
}

// Site Status

export const getSiteStatus = async (
    id: string
): Promise<SiteStatusResponse> => {
    try {
        const site = await SiteModel.findById(id)
        if (!site) throw new GraphQLError("site not found")

        // const domains: VercelProjectDomain[] =
        //    (await getProjectDomainsFromVercel(site.vercelProjectId as string))
        //        ?.domains ?? []

        // logger.info({ domains }, "project domains")

        const project = (await getProject(
            site.vercelProjectId as string
        )) as VercelProjectResponse

        if (!project) throw new GraphQLError("Vercel Project not found")
        if (project?.latestDeployments?.length === 0) {
            throw "no deployments found"
        }

        // TODO: Get all site domains from vercel,
        // check for the configuration of each domain
        // and return the first domain with the verified: true && misconfigured: false

        return {
            success: true,
            message: "Project status fetched successfully",
            data: {
                createdAt: project.createdAt,
                // @ts-expect-error we dont have the type for readyState
                readyState: project?.targets?.production?.readyState
            }
        }
    } catch (error: any | GraphQLError) {
        logger.error(error)

        return {
            success: false,
            message: error.message || error
        }
    }
}

// Deploy Site
export const deploySite = async (
    context: AuthRequestContext,
    siteId: string
    // subscriptionId: string
): Promise<DeploySiteResponse> => {
    try {
        logger.debug(
            `↳ Starting site deploy: ${siteId} for user: ${context.user?.email}`
        )
        // Fetch Site with siteId
        const site = await SiteModel.findById(siteId)
        if (!site) throw new GraphQLError("Site not found")

        // Check if the request is coming from site owner
        if (site.owner?.toString() !== context.user?.id && !context.isApiKey) {
            throw new GraphQLError("Unauthorized")
        }

        // Get the template from the database
        const template = await TemplateModel.findById(site.template)
        if (!template) throw new GraphQLError("No Template found")
        logger.log(`👉 Template fetched from database: ${template.id}`)

        // Maybe NOT TODO: We need check if the project exists on Vercel. If not create it.
        /**
         * We need to also check if the project has any latestDeployments.
         * If there's a deployment that's Ready, we need promote it to production.
         * */

        const deployPayload: IVercelCreateDeploymentBody = {
            name: site.slug as string,
            files: [],
            gitSource: template?.gitSource,
            target: "production",
            projectSettings: {
                framework: FrameworkEnum.NEXTJS
            }
        }

        // 6. Create Deployment
        const deployment = await createDeployment({
            body: deployPayload,
            forceNew: true
        })

        logger.debug(`🎉 Deployment finished: ${deployment.id}`)

        // Get the site status from vercelProjectId
        const vercelProject = await getProject(site.vercelProjectId as string)

        const projectStatus = {
            createdAt: vercelProject?.createdAt,
            // @ts-expect-error we dont have the type for readyState
            readyState: vercelProject?.targets?.production?.readyState
        }

        // After sucessful deployment, make the index page public
        const indexPage = await PageModel.findOne({
            site: siteId,
            slug: "index"
        })

        if (!indexPage) {
            logger.warn(`🚫 No Index page found for site: ${siteId}`)
        }

        if (indexPage) {
            logger.debug(`👌 Found Index page: ${indexPage?.id}`)

            const updatedIndexPage = await PageModel.findByIdAndUpdate(
                indexPage?.id,
                {
                    body: indexPage?.draftBody,
                    isPublic: true
                },
                { new: true }
            )

            logger.debug(
                `✅ Updated Index page: ${updatedIndexPage?.id} \n isPublic: ${updatedIndexPage?.isPublic}`
            )
        }

        logger.debug(`Index page made isPublic: ${indexPage?.isPublic}`)

        return {
            success: true,
            message: "Site Deployed successfully",
            siteId: site._id.toString(),
            status: projectStatus
        }
    } catch (error: any) {
        logger.error("deploySite", error)

        return {
            success: false,
            message: error
        }
    }
}

export const updatePrimaryDomain = async (
    domainName: string,
    siteId: string,
    context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        if (!domainName || !siteId)
            throw new GraphQLError("Missing required fields")

        logger.log({ domainName, siteId }, "👉 updatePrimaryDomain")

        const site = await SiteModel.findById(siteId)

        if (!site) throw new GraphQLError("Site not found")
        if (site.owner?.toString() !== context.user?.id)
            throw new GraphQLError("Unauthorized")

        // logger.debug("👉 updatePrimaryDomain", site.id)

        // TODO: check if domain is one of the domains from the vercelProject
        // check domain configuration and if it belongs to the vercelProject

        const domainConfig = (await checkDomainConfiguration(
            domainName
        )) as DomainConfigurationInterface

        if (!domainConfig) {
            throw new GraphQLError("Domain config not found")
        }

        if (domainConfig.misconfigured) {
            throw new GraphQLError("Domain's configuration is not valid")
        }

        const verifyDomain = await verifyProjectDomain(
            site.vercelProjectId as string,
            domainName
        )

        if (!verifyDomain.verified) {
            throw new GraphQLError("Unverified domain cannot be primary domain")
        }

        if (verifyDomain.projectId !== site.vercelProjectId) {
            throw new GraphQLError("Domain doesn't belong to the site")
        }

        const updatedSite = await SiteModel.findByIdAndUpdate(
            siteId,
            {
                primaryDomain: domainName
            },
            { new: true }
        )

        return {
            success: true,
            message: "Primary domain updated successfully",
            data: updatedSite!
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || error
        }
    }
}

// Add Custom Domain
export const addCustomDomain = async (
    siteId: string,
    domainName: string,
    context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        // Reject addition of vercel domains
        if (domainName.includes("vercel.app")) {
            throw new GraphQLError("Cannot delete this domain")
        }

        // Fetch Site with siteId
        let site = (await SiteModel.findById(siteId)) as Site
        if (!site) throw new GraphQLError("Site not found")

        // Check if the request is coming from site owner
        if (context.user?.id !== site.owner?.toString()) {
            // DEBUG
            // logger.log("Permission Check", context.user, site.owner)
            throw new Error("You don't have permission to do this")
        }

        // check if the site has a vercelProjectID
        if (site.vercelProjectId) {
            // Add the domain to the project
            const AddDomainToProjectResponse = await addDomainToProjectVercel(
                site.vercelProjectId,
                domainName
            )

            if (AddDomainToProjectResponse.error) {
                //  If there's an error, throw it
                throw new GraphQLError(AddDomainToProjectResponse.error.message)
            }

            // Get the new list of domains from vercel
            const allProjectDomains = await getProjectDomainsFromVercel(
                site.vercelProjectId
            )

            // Update the customDomain list from vercel
            site = (await SiteModel.findByIdAndUpdate(
                siteId,
                {
                    customDomain: allProjectDomains.domains
                },
                { new: true }
            )) as Site

            logger.log(
                {
                    site,
                    customDomain: site.customDomain
                },
                "domain added successfully"
            )
        }

        return {
            success: true,
            message: "Domain added successfully",
            data: site
        }
    } catch (error: any | GraphQLError) {
        logger.error(error.message)

        return {
            success: false,
            message: error.message || error
        }
    }
}

// Delete Custom Domain from Project / Site
export const deleteCustomDomain = async (
    siteId: string,
    domainName: string,
    context: AuthRequestContext
): Promise<SiteResponse> => {
    try {
        // Reject deletion of vercel domains
        if (domainName.includes("vercel.app")) {
            throw new GraphQLError("Cannot delete this domain")
        }

        // Fetch Site with siteId
        let site = (await SiteModel.findById(siteId)) as Site
        if (!site) throw new GraphQLError("Site not found")

        // Reject deletion of site-name.lokus.website (publicSiteDomain)
        if (
            domainName.toLowerCase() ===
            `${site.slug.toLowerCase()}.${publicSiteDomain}`
        ) {
            throw new GraphQLError("Cannot delete this domain")
        }

        // Check if the request is coming from site owner
        if (context.user?.id !== site.owner?.toString()) {
            // DEBUG
            // logger.log("Permission Check", context.user, site.owner)
            throw new GraphQLError(
                "You are not authorized to delete custom domain"
            )
        }

        if (site.vercelProjectId) {
            const removeDomainResponse = await removeDomainFromProjectVercel(
                site.vercelProjectId,
                domainName
            )
            logger.log("👉 removeDomainResponse", removeDomainResponse)
            if (removeDomainResponse.error) {
                throw new GraphQLError(removeDomainResponse.error.message)
            }

            // Get the new list of domains from vercel
            const allProjectDomains = await getProjectDomainsFromVercel(
                site.vercelProjectId
            )

            // Remove the domain from the DB record of the site
            site = (await SiteModel.findByIdAndUpdate(
                siteId,
                {
                    // TODO: This needs to be an array of domains
                    customDomain: allProjectDomains.domains
                },
                { new: true }
            )) as Site
        }
        return {
            success: true,
            message: "Domain removed successfully",
            data: site
        }
    } catch (error: any | GraphQLError) {
        logger.log(error.message)
        return {
            success: false,
            message: error.message || error
        }
    }
}

export const getAllDomainsOfSite = async (
    siteId: string,
    context: AuthRequestContext
): Promise<SiteDomainsResponse> => {
    try {
        const site = (await SiteModel.findById(siteId)) as Site
        if (!site) throw new GraphQLError("Site not found")

        if (context.user!.id.toString() !== site!.owner?.toString()) {
            throw new GraphQLError("Unauthorized")
        }

        if (site.vercelProjectId) {
            // fetch all domains of the vercelProject with VercelProjectID
            const vercelAPIResponse = await getProjectDomainsFromVercel(
                site.vercelProjectId
            )

            if (vercelAPIResponse.error) {
                throw new GraphQLError(vercelAPIResponse.error)
            }

            return {
                success: true,
                message: `Site has ${vercelAPIResponse?.domains?.length} verified /active domains`,
                data: vercelAPIResponse
            }
        }
        throw new GraphQLError("No Vercel Project ID found")
    } catch (error: any) {
        logger.log(error)

        return {
            success: false,
            message: error.message || "Error fetching domains list"
        }
    }
}

export const verifyProjectDomain = async (
    projectName: string,
    domain: string
): Promise<VercelProjectDomain> => {
    try {
        const vercelAPIResponse = await verifyProjectDomainVercel(
            projectName,
            domain
        )
        logger.log("👉 vercelAPIResponse", vercelAPIResponse)

        if (vercelAPIResponse.error) {
            throw new GraphQLError(vercelAPIResponse.error)
        }

        return vercelAPIResponse as VercelProjectDomain
    } catch (error: any) {
        logger.log("🚫 verifyProjectDomain error", error)
        return error
    }
}

export const checkSiteNameAvailability = async (
    siteNameOrSlug: string
): Promise<ResponseSchema> => {
    try {
        // Sanitize before checking
        const sanitizedSiteName = slugify(siteNameOrSlug)

        logger.log(`Received Site Name: ${siteNameOrSlug}`)
        logger.log(`Sanitized Site Name: ${sanitizedSiteName}`)

        // Check if the site name is reserved
        if (reservedNames.includes(sanitizedSiteName)) {
            return {
                success: false,
                message: "Site name is reserved"
            }
        }

        const prefix =
            process.env.NODE_ENV !== "production"
                ? `${process.env.NODE_ENV}-`
                : ""

        const existingSite = await SiteModel.findOne({
            slug: `${prefix}${sanitizedSiteName}`
        })

        return existingSite
            ? {
                  success: false,
                  message: "Site name already taken"
              }
            : {
                  success: true,
                  message: "Site name available"
              }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Error checking site name availability"
        }
    }
}

/**
 * Change Site Template
 * @param siteId
 * @param templateId
 * @param context
 * @returns SiteResponse
 *
 */

export const changeSiteTemplate = async (
    siteId: string,
    templateId: string,
    context: AuthRequestContext
): Promise<ChangeSiteTemplateResponse> => {
    try {
        // Fetch Site with siteId
        const site = await SiteModel.findById(siteId)
        if (!site) throw new GraphQLError("Site not found")

        if (context.user?.id !== site.owner?.toString() || !context.isApiKey) {
            throw new GraphQLError("Unauthorized")
        }

        // Fetch Template with templateId
        const template = await TemplateModel.findById(templateId)
        if (!template) throw new GraphQLError("Template not found")
        logger.log(`Template Found: ${template.id}`)

        // TODO: Check for if the template is on the freeChangeCategory

        // Update the site with the new template
        const updatedSite = await SiteModel.findByIdAndUpdate(
            siteId,
            {
                template: templateId
            },
            { new: true }
        )
        if (!updatedSite) throw new GraphQLError("Error updating site")

        logger.log(
            `Site Updated: \n\t SiteId: ${updatedSite.id}, \n\t TemplateId: ${updatedSite.template}`
        )

        // Get the site status from vercelProjectId
        const vercelProject = await getProject(site.vercelProjectId as string)
        logger.log(`Vercel Project: ${JSON.stringify(vercelProject, null, 2)}`)

        // if vercelProject doesn't have env vars or doesn't match site ID, then update the env vars
        if (
            !vercelProject.env ||
            // @ts-expect-error we dont have the type for env
            vercelProject.env["NEXT_PUBLIC_SITE_ID"] !== site.id.toString() ||
            // @ts-expect-error we dont have the type for env
            vercelProject.env["NEXT_PUBLIC_API_ENDPOINT"] !==
                publicGraphQlEndpoint
        ) {
            logger.log("Updating Vercel Project Env Vars")
            const updateEnvironmentVariables = await CreateProjectEnvironment(
                vercelProject.id,
                site.id.toString()
            )
            logger.log(
                `Updated Vercel Project Env Vars: ${JSON.stringify(
                    updateEnvironmentVariables,
                    null,
                    2
                )}`
            )
        }

        // TODO: Should redeploy the site with the new template,
        // if template belongs to the freeChangeCategory, else should mark site as needsPayment

        const deployPayload: IVercelCreateDeploymentBody = {
            name: site.slug as string,
            files: [],
            gitSource: template?.gitSource,
            target: "production",
            projectSettings: {
                framework: FrameworkEnum.NEXTJS
            }
        }
        logger.log(`Deploy Payload: ${JSON.stringify(deployPayload, null, 2)}`)
        logger.log("Deploying Site...")

        // 6. Create Deployment
        const deployment = await createDeployment({
            body: deployPayload,
            forceNew: true
        })
        logger.log(`Deployment Created: ${JSON.stringify(deployment, null, 2)}`)

        //TODO: Project status is not useful here as it returns the status of the previous deployment.
        // Change this to return the deployment response.

        const projectStatus = {
            createdAt: vercelProject?.createdAt,
            // @ts-expect-error we dont have the type for readyState
            readyState: vercelProject?.targets?.production?.readyState
        }
        logger.log(`Project Status: ${JSON.stringify(projectStatus, null, 2)}`)

        return {
            success: true,
            message: "Site template updated successfully",
            data: updatedSite,
            siteStatus: {
                success: true,
                ...projectStatus
            }
        }
    } catch (error: any) {
        logger.log(
            `🚫 Error updating site template: ${JSON.stringify(error, null, 2)}`
        )
        return {
            success: false,
            message: error.message || "Error updating site template",
            siteStatus: {
                success: false,
                message: error.message || "Error updating site template"
            }
        }
    }
}

/**
 * Update Page Headers
 */

/**
 * ==================================================
 * Logo for Site
 * ==================================================
 */

export const addLogo = async (
    context: AuthRequestContext,
    siteId: string,
    desktopLogoId?: string,
    mobileLogoId?: string
): Promise<SiteResponse> => {
    try {
        let desktopLogo, mobileLogo
        // Site Checks
        const site = await SiteModel.findById(siteId)
        if (!site) {
            throw new Error("Site not found")
        }
        if (site.owner.toString() !== context!.user!.id) {
            throw new Error("Unauthorized")
        }

        // Desktop Logo Checks
        if (desktopLogoId) {
            desktopLogo = await AssetModel.findById(desktopLogoId)
            if (!desktopLogo) {
                throw new Error("Desktop Logo not found")
            }
            if (desktopLogo.owner.toString() !== context!.user!.id) {
                throw new Error("Youdo not own this logo")
            }
        }

        // Mobile Logo Checks
        if (mobileLogoId) {
            mobileLogo = await AssetModel.findById(mobileLogoId)
            if (!mobileLogo) {
                throw new Error("Logo not found")
            }
            if (mobileLogo.owner.toString() !== context!.user!.id) {
                throw new Error("Youdo not own this mobileLogo")
            }
        }

        const updatedSite = await SiteModel.findByIdAndUpdate(
            siteId,
            {
                desktopLogo: new Types.ObjectId(desktopLogoId),
                mobileLogo: new Types.ObjectId(mobileLogoId)
            },
            {
                new: true
            }
        )

        return {
            success: false,
            message: "Logo added successfully",
            data: updatedSite as Site
        }
    } catch (error: GraphQLError | Error | any) {
        logger.log("Error adding logo", error)
        return {
            success: false,
            message: error.message || "Error adding logo"
        }
    }
}

export const removeLogo = async (
    context: AuthRequestContext,
    siteId: string,
    logoType: "desktop" | "mobile" | "both"
): Promise<SiteResponse> => {
    try {
        // Site Checks
        const site = await SiteModel.findById(siteId)
        if (!site) {
            throw new Error("Site not found")
        }
        if (site.owner.toString() !== context!.user!.id) {
            throw new Error("Unauthorized")
        }
        if (logoType === "both") {
            const updatedSite = await SiteModel.findByIdAndUpdate(
                siteId,
                {
                    desktopLogo: null,
                    mobileLogo: null
                },
                {
                    new: true
                }
            )

            return {
                success: true,
                message: "Logo removed successfully",
                data: updatedSite as Site
            }
        }

        const updatedSite = await SiteModel.findByIdAndUpdate(
            siteId,
            {
                [logoType + "Logo"]: null
            },
            {
                new: true
            }
        )

        return {
            success: true,
            message: "Logo removed successfully",
            data: updatedSite as Site
        }
    } catch (error: GraphQLError | Error | any) {
        logger.log("Error removing logo", error)
        return {
            success: false,
            message: error.message || "Error removing logo"
        }
    }
}

// Admin API Only

interface DeployAllSitesByTemplateResponse {
    finished: boolean
    message: string
    data: {
        siteId: string
        templateId: string
        deploymentId: string
        name: string
        state:
            | "QUEUED"
            | "BUILDING"
            | "ERROR"
            | "INITIALIZING"
            | "READY"
            | "CANCELED"
    }[]
}

export const deployAllSitesByTemplate = async (
    templateId: string
): Promise<DeployAllSitesByTemplateResponse> => {
    const response = {
        finished: false,
        message: "",
        data: []
    } as DeployAllSitesByTemplateResponse
    try {
        logger.log(`Deploying all sites with templateId: ${templateId}`)
        const template = await TemplateModel.findById(templateId)
        logger.log(`Template found with templateId: ${templateId}`)

        if (!template) {
            throw new Error("Template not found")
        }

        const allSites = await SiteModel.find({
            template: templateId
        })
        logger.log(
            `${allSites.length} sites found with templateId: ${templateId}`
        )

        if (!allSites) {
            throw new Error("No sites found")
        }

        for (const site of allSites) {
            logger.log(`Triggering deploy for site: ${site.slug}`)
            const deployPayload: IVercelCreateDeploymentBody = {
                name: site.slug as string,
                files: [],
                gitSource: template.gitSource,
                target: "production",
                projectSettings: {
                    framework: FrameworkEnum.NEXTJS
                }
            }

            logger.log(
                `Deploy Payload: ${JSON.stringify(deployPayload, null, 2)}`
            )

            logger.log("Deploying Site...")
            // Create Deployment
            const deployment = await createDeployment({
                body: deployPayload,
                forceNew: true
            })

            logger.log(
                `Deployment created with for ${site.id}: ${deployment.id}`
            )

            response.data.push({
                siteId: site.id,
                deploymentId: deployment.id,
                templateId: template.id,
                name: site.slug,
                state: deployment.readyState
            })
        }

        response.finished = true
        response.message = `${allSites.length} sites have been triggered to deploy`
        return response
    } catch (error: GraphQLError | Error | any) {
        logger.error(error)

        response.finished = false
        response.message =
            error.message || "Error deploying all sites by template"
        return response
    }
}

/***
 * DANGER ZONE
 */

export const deleteAllSites = async () => {
    try {
        const allSites = await SiteModel.find()
        logger.log(`Deleting ${allSites.length} sites`)

        for (const site of allSites) {
            await deleteSite(site.id, {
                isAuthenticated: true
            })
        }
    } catch (error) {
        logger.error("deleteAllSites", error)
    }
}

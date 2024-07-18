import * as SiteController from "./site.controller"
import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql"
import { Asset, AssetModel } from "../asset/asset.type"
import { ChangeSiteTemplateResponse } from "./types/change-site-templates.response"
import { CreateSiteResponse } from "./types/create-site.response"
import { DeploySiteResponse } from "./types/deploy-response"
import { Page, PageModel } from "../page/page.type"
import { ResponseSchema } from "types/response-schema.type"
import { Site } from "./site.type"
import { SiteDomainsResponse } from "./types/site-domains.response"
import { SiteInput } from "./types/site.input"
import { SiteResponse } from "./types/site.response"
import { SiteStatusResponse } from "./types/site-status.response"
import { SitesResponse } from "./types/sites.response"
import { UpdateSiteInput } from "./types/update-site.input"
import { User, UserModel } from "../user/user.type"
import { VercelProjectDomain } from "./types/vercel-domain.response"
import { getProject } from "libs/vercel"
import { getRootPage } from "../page/page.controller"
import { logger } from "logger"
import type { AuthRequestContext } from "auth/request-context"
import type { DocumentType } from "@typegoose/typegoose"

@Resolver(_of => Site)
export class SiteResolver {
    @FieldResolver()
    async owner(@Root() site: DocumentType<Site>): Promise<User> {
        return (await UserModel.findById(site.owner)) as User
    }

    @FieldResolver()
    async pages(@Root() site: DocumentType<Site>): Promise<Page[]> {
        return await PageModel.find({ site: site._id })
    }

    @FieldResolver({ nullable: true })
    async desktopLogo(@Root() site: DocumentType<Site>): Promise<Asset | null> {
        return await AssetModel.findById(site.desktopLogo)
    }

    @FieldResolver({ nullable: true })
    async mobileLogo(@Root() site: DocumentType<Site>): Promise<Asset | null> {
        return await AssetModel.findById(site.mobileLogo)
    }

    @FieldResolver()
    async url(@Root() site: DocumentType<Site>): Promise<string> {
        const proj = await getProject(site.vercelProjectId!)
        // @ts-expect-error because we don't have the type
        return proj?.targets?.production?.alias[0] || ""
    }

    @FieldResolver(_type => [Page], {
        nullable: true,
        deprecationReason: "use rootPage instead",
        complexity: 5
    })
    async headerPages(@Root() site: DocumentType<Site>): Promise<Page[]> {
        logger.log("headerPages resolver", site)
        const headerPages = await PageModel.find({
            // slug !== index
            slug: { $nin: ["index", "root", `root${site._id}`] },
            site: site._id,
            isPublic: true,
            parent: null || undefined
        })
            .sort({ priority: 1 })
            .exec()
        logger.log("headerPages", headerPages)
        return headerPages
    }

    @FieldResolver(_type => Page, { complexity: 4 })
    async rootPage(@Root() site: DocumentType<Site>): Promise<Page> {
        return (await getRootPage(site._id.toString())).data! as Page
    }

    // Get Site Info
    @Query(_returns => SiteResponse)
    async getSiteById(@Arg("id") id: string): Promise<SiteResponse> {
        return await SiteController.getSiteById(id)
    }

    // Get all mySites
    @Authorized()
    @Query(_returns => SitesResponse)
    async getAllMySite(
        @Ctx() context: AuthRequestContext
    ): Promise<SitesResponse> {
        return await SiteController.getAllMySites(context)
    }

    // Get My Site
    @Query(_returns => SiteResponse)
    async getMySiteById(@Arg("id") id: string): Promise<SiteResponse> {
        return await SiteController.getSiteById(id)
    }

    // Get site status
    @Query(_returns => SiteStatusResponse)
    async getSiteStatus(@Arg("id") id: string): Promise<SiteStatusResponse> {
        return await SiteController.getSiteStatus(id)
    }

    // Get Site Name Availability
    @Query(_returns => ResponseSchema)
    async checkSiteNameAvailability(
        @Arg("nameOrSlug") nameOrSlug: string
    ): Promise<ResponseSchema> {
        return await SiteController.checkSiteNameAvailability(nameOrSlug)
    }

    // Create a Site
    @Authorized()
    @Mutation(_returns => CreateSiteResponse)
    async createSite(
        @Arg("data") data: SiteInput,
        @Ctx() context: AuthRequestContext
    ): Promise<CreateSiteResponse> {
        return await SiteController.createSite(data, context)
    }

    // Update a Site
    @Authorized()
    @Mutation(_returns => SiteResponse)
    async updateSite(
        @Arg("id") id: string,
        @Arg("data") data: UpdateSiteInput,
        @Ctx() context: AuthRequestContext
    ): Promise<SiteResponse> {
        return await SiteController.updateSite(id, data, context)
    }

    // Change Site Template
    @Authorized()
    @Mutation(_returns => ChangeSiteTemplateResponse)
    async changeSiteTemplate(
        @Arg("siteId") id: string,
        @Arg("templateId") templateId: string,
        @Ctx() context: AuthRequestContext
    ): Promise<ChangeSiteTemplateResponse> {
        return await SiteController.changeSiteTemplate(id, templateId, context)
    }

    @Authorized()
    @Mutation(_returns => ResponseSchema)
    async deleteSite(
        @Arg("id") id: string,
        @Ctx() context: AuthRequestContext
    ): Promise<ResponseSchema> {
        return await SiteController.deleteSite(id, context)
    }

    // Add Custom Domain
    @Authorized()
    @Mutation(_returns => SiteResponse)
    async addCustomDomain(
        @Arg("siteId") siteId: string,
        @Arg("domainName") domainName: string,
        @Ctx() context: AuthRequestContext
    ): Promise<SiteResponse> {
        return await SiteController.addCustomDomain(siteId, domainName, context)
    }

    // Delete Custom Domain
    @Authorized()
    @Mutation(_returns => SiteResponse)
    async deleteCustomDomain(
        @Arg("siteId") siteId: string,
        @Arg("domainName") domainName: string,
        @Ctx() context: AuthRequestContext
    ): Promise<SiteResponse> {
        return await SiteController.deleteCustomDomain(
            siteId,
            domainName,
            context
        )
    }

    @Authorized()
    @Mutation(_returns => SiteResponse)
    async updatePrimaryDomain(
        @Arg("domainName") domainName: string,
        @Arg("siteId", _type => ID) siteId: string,
        @Ctx() context: AuthRequestContext
    ): Promise<SiteResponse> {
        return await SiteController.updatePrimaryDomain(
            domainName,
            siteId,
            context
        )
    }

    // Get All Site Domains Linked
    @Authorized()
    @Query(_returns => SiteDomainsResponse)
    async getAllSiteDomainsLinked(
        @Arg("id") id: string,
        @Ctx() context: AuthRequestContext
    ): Promise<SiteDomainsResponse> {
        return await SiteController.getAllDomainsOfSite(id, context)
    }

    @Authorized()
    @Query(_returns => VercelProjectDomain)
    async verfiyProjectDomain(
        @Arg("projectName") projectName: string,
        @Arg("domainName") domainName: string
    ): Promise<VercelProjectDomain> {
        // TODO: Fix inconsitent or invalid Return types here
        return await SiteController.verifyProjectDomain(projectName, domainName)
    }

    @Authorized()
    @Mutation(_returns => DeploySiteResponse)
    async deploySite(
        @Ctx() context: AuthRequestContext,
        @Arg("siteId") siteId: string
    ): Promise<DeploySiteResponse> {
        return await SiteController.deploySite(context, siteId)
    }

    // LOGO
    @Authorized()
    @Mutation(_returns => SiteResponse)
    async updateSiteLogo(
        @Ctx() context: AuthRequestContext,
        @Arg("siteId") siteId: string,
        @Arg("desktopLogo", { nullable: true }) desktopLogo?: string,
        @Arg("mobileLogo", { nullable: true }) mobileLogo?: string
    ): Promise<SiteResponse> {
        return await SiteController.addLogo(
            context,
            siteId,
            desktopLogo,
            mobileLogo
        )
    }

    // REMOVE LOGO
    @Authorized()
    @Mutation(_returns => SiteResponse)
    async removeSiteLogo(
        @Ctx() context: AuthRequestContext,
        @Arg("siteId") siteId: string,
        @Arg("logoType", { defaultValue: "both" })
        logoType: "both" | "desktop" | "mobile"
    ): Promise<SiteResponse> {
        return await SiteController.removeLogo(context, siteId, logoType)
    }
}

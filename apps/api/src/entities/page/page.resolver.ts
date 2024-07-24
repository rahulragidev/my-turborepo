import * as PageController from "./page.controller"
import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql"
import { Page, PageModel } from "./page.type"
import { PageResponse } from "./types/page.response"
import type { AuthRequestContext } from "auth/request-context"
// import { PageBlock } from "./types/page-block.type"
import { PageFilterEnum } from "./types/page-filter.enum"
import { PagesResponse } from "./types/pages.response"
// import { UpdatePageInput } from "./types/update-page-input"
import { Asset, AssetModel } from "../../entities/asset/asset.type"
import { ResponseSchema } from "types/response-schema.type"
import { UpdatePageInput } from "./types/update-page-input"
import { UpdatePagesPriorityInput } from "./types/update-pages-priority.input"
import type { DocumentType } from "@typegoose/typegoose"

@Resolver(_of => Page)
export class PageResolver {
    //  Get Children

    @FieldResolver()
    async children(@Root() page: DocumentType<Page>): Promise<Page[]> {
        return await PageController.getPageChildren(page._id.toString())
    }

    // Get Parent Page
    @FieldResolver()
    async parent(
        @Root() page: DocumentType<Page>
    ): Promise<DocumentType<Page> | null> {
        return await PageModel.findById(page.parent)
    }

    // Baner Image Field resolver
    @FieldResolver()
    async bannerImage(
        @Root() page: DocumentType<Page>
    ): Promise<DocumentType<Asset> | null> {
        return await AssetModel.findById(page.bannerImage)
    }

    @Query(_return => PagesResponse)
    async getAllPagesBySite(
        @Arg("siteId") siteId: string,
        @Arg("filter", _type => PageFilterEnum, { nullable: true })
        filter?: PageFilterEnum
    ): Promise<PagesResponse> {
        return await PageController.getAllPagesBySite(siteId, filter)
    }

    @Query(_return => PageResponse)
    async getRootPage(@Arg("siteId") siteId: string): Promise<PageResponse> {
        return await PageController.getRootPage(siteId)
    }

    @Query(_return => PagesResponse)
    async getAllOrphanPagesBySite(
        @Arg("siteId") siteId: string,
        @Arg("filter", _type => PageFilterEnum, { nullable: true })
        filter?: PageFilterEnum
    ): Promise<PagesResponse> {
        return await PageController.getAllOrphanPagesBySite(siteId, filter)
    }

    @Query(_return => PagesResponse)
    async getFeaturedPagesBySite(
        @Arg("siteId") siteId: string,
        @Arg("filter", _type => PageFilterEnum, { nullable: true })
        filter?: PageFilterEnum
    ): Promise<PagesResponse> {
        return await PageController.getFeaturedPagesBySite(siteId, filter)
    }

    @Query(_returns => PageResponse)
    async getPage(@Arg("id") id: string): Promise<PageResponse> {
        return await PageController.getPage(id)
    }

    @Query(_returns => PageResponse)
    async getPageBySlug(
        @Arg("siteId") siteId: string,
        @Arg("slug") slug: string,
        @Arg("filter", _type => PageFilterEnum, { nullable: true })
        filter: PageFilterEnum
    ): Promise<PageResponse> {
        return await PageController.getPageBySlug(siteId, slug, filter)
    }

    @Authorized()
    @Mutation(_returns => PageResponse)
    async createPage(
        @Ctx() context: AuthRequestContext,
        @Arg("siteId") siteId: string,
        @Arg("name") name: string,
        @Arg("parent", { nullable: true }) parent?: string
        // @Arg("body", _type => [PageBlockInput]) body: PageBlockInput[]
    ): Promise<PageResponse> {
        return await PageController.createPage(context, siteId, name, parent)
    }

    @Authorized()
    @Mutation(_returns => PageResponse)
    async updatePage(
        @Arg("id") id: string,
        @Arg("data", _type => UpdatePageInput) data: UpdatePageInput,
        @Ctx() context: AuthRequestContext
    ): Promise<PageResponse> {
        return await PageController.updatePage(id, data, context)
    }

    @Authorized()
    @Mutation(_returns => PageResponse)
    async publishPage(
        @Arg("id") id: string,
        @Ctx() context: AuthRequestContext
    ): Promise<PageResponse> {
        return await PageController.publishPage(id, context)
    }

    @Authorized()
    @Mutation(_returns => PageResponse)
    async deletePage(
        @Arg("id") id: string,
        @Ctx() context: AuthRequestContext
    ) {
        return await PageController.deletePage(id, context)
    }

    // assignParent
    @Authorized()
    @Mutation(_returns => PageResponse)
    async assignParent(
        @Ctx() context: AuthRequestContext,
        @Arg("pageId") pageId: string,
        @Arg("parentId") parentId: string
    ) {
        return await PageController.assignParent(context, pageId, parentId)
    }

    @Authorized()
    @Mutation(_returns => ResponseSchema)
    async updateSitePagesPriority(
        @Ctx() context: AuthRequestContext,
        @Arg("data") data: UpdatePagesPriorityInput
    ): Promise<ResponseSchema> {
        return await PageController.updateSitePagesPriority(context, data)
    }

    // removeParent
    @Authorized()
    @Mutation(_returns => PageResponse, {
        description: "Warning! Don't use this."
    })
    async removeParent_deprecated(
        @Ctx() context: AuthRequestContext,
        @Arg("pageId") pageId: string
    ) {
        return await PageController.removeParent_deprecated(context, pageId)
    }

    // reassignParent

    // @Authorized()
    // @Mutation(_returns => PagesResponse)
    // async updatePagePriority(
    //     @Ctx() context: AuthRequestContext,
    //     @Arg("pageId") pageId: string,
    //     @Arg("newPriority") newPriority: number
    // ) {
    //     return await PageController.updatePagePriority(
    //         context,
    //         pageId,
    //         newPriority
    //     )
    // }
}

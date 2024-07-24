import * as TemplateController from "./template.controller"
import getStripeProductById from "libs/stripe/get-stripe-product-by-id"
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
import { ResponseSchema } from "types/response-schema.type"
import { StripeProduct } from "./types/stripe-product.type"
import { Template } from "./template.type"
import { TemplateInput } from "./types/template.input"
import { TemplateResponse } from "./types/template.response"
import { TemplateUpdateInput } from "./types/template-update.input"
import { TemplatesResponse } from "./types/templates.response"
import type { AuthRequestContext } from "auth/request-context"
import type { DocumentType } from "@typegoose/typegoose"

@Resolver(_of => Template)
export class TemplateResolver {
    @FieldResolver(_returns => StripeProduct)
    async stripeProduct(
        @Root() template: DocumentType<Template>
    ): Promise<StripeProduct | null> {
        return await getStripeProductById(template.stripeProduct as string)
    }

    //@FieldResolver(_returns => Asset)
    //async bannerImage(
    //    @Root() template: DocumentType<Template>
    //): Promise<Asset | null> {
    //    return await AssetModel.findById(template.bannerImage)
    //}

    @Authorized()
    @Query(_returns => TemplateResponse)
    async getTemplateById(@Arg("id") id: string): Promise<TemplateResponse> {
        return await TemplateController.getTemplateById(id)
    }

    @Query(_returns => TemplatesResponse)
    async getTemplates(): Promise<TemplatesResponse> {
        return await TemplateController.getTemplates()
    }

    @Authorized()
    @Mutation(_returns => TemplateResponse)
    async createTemplate(
        @Arg("inputData") inputData: TemplateInput,
        @Ctx() context: AuthRequestContext
    ): Promise<TemplateResponse> {
        return await TemplateController.createTemplate(inputData, context)
    }

    @Authorized()
    @Mutation(_returns => ResponseSchema)
    async deleteTemplate(
        @Arg("id") id: string
        // @Ctx() context: AuthRequestContext
    ): Promise<ResponseSchema> {
        return await TemplateController.deleteTemplate(id)
    }

    @Authorized()
    @Mutation(_returns => TemplateResponse)
    async updateTemplateBannerImage(
        @Arg("id") id: string,
        @Arg("bannerImage") bannerImage: string,
        @Ctx() context: AuthRequestContext
    ): Promise<TemplateResponse> {
        return await TemplateController.updateTemplateBannerImage(
            id,
            bannerImage,
            context
        )
    }

    @Authorized()
    @Mutation(_returns => TemplateResponse, {
        description: "Admin only, needs API key"
    })
    async updateTemplate(
        @Ctx() context: AuthRequestContext,
        @Arg("id") id: string,
        @Arg("data") data: TemplateUpdateInput
    ): Promise<TemplateResponse> {
        return await TemplateController.updateTemplate(context, id, data)
    }
}

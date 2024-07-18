import { AuthRequestContext } from "auth/request-context"
import { AuthRole } from "auth/roles"
import { GraphQLError } from "graphql"
import { ResponseSchema } from "types/response-schema.type"
import { Template, TemplateModel } from "./template.type"
import { TemplateInput } from "./types/template.input"
import { TemplateResponse } from "./types/template.response"
import { TemplateUpdateInput } from "./types/template-update.input"
import { TemplatesResponse } from "./types/templates.response"
import { Types } from "mongoose"
import { stripe } from "utils/stripe"

export const createTemplate = async (
    inputData: TemplateInput,
    context: AuthRequestContext
): Promise<TemplateResponse> => {
    try {
        if (context.user?.role != AuthRole.ADMIN)
            throw new GraphQLError("You're not authorized to create!")

        // check if the inputData.stripeProduc is a valid product from stripe
        if (inputData.stripeProduct) {
            const stripeProduct = await stripe.products.retrieve(
                inputData.stripeProduct
            )
            if (!stripeProduct)
                throw new GraphQLError("No product Id found in stripe")
        }

        const payload = {
            ...inputData,
            creator: new Types.ObjectId(context.user?.id)
        }
        const data = await TemplateModel.create(payload)
        return {
            success: true,
            message: "Template created Successfully",
            data
        }
    } catch (error: any) {
        return {
            success: false,
            statusCode: error.statusCode || 500,
            message: error.message
        }
    }
}

export const getTemplateById = async (
    id: string
): Promise<TemplateResponse> => {
    try {
        const data = (await TemplateModel.findById(id)) as Template
        return {
            success: true,
            message: "Template created Successfully",
            data
        }
    } catch (error: any) {
        return {
            success: false,
            statusCode: error.statusCode || 500,
            message: error.message
        }
    }
}

export const getTemplates = async (): Promise<TemplatesResponse> => {
    try {
        const data = (await TemplateModel.find()) as Template[]
        if (!data) throw new Error("nothing found")
        return {
            data,
            success: true,
            statusCode: 200,
            message: `${data.length} templates found!`
        }
    } catch (error: any) {
        return {
            success: false,
            statusCode: error.statusCode || 500,
            message: `error: ${error.message}`
        }
    }
}

export const deleteTemplate = async (id: string): Promise<ResponseSchema> => {
    try {
        const response = await TemplateModel.findByIdAndDelete(id)
        return {
            success: true,
            message: response?.$isDeleted
                ? "Template deleted"
                : "Template not found"
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const updateTemplate = async (
    context: AuthRequestContext,
    id: string,
    data: TemplateUpdateInput
): Promise<TemplateResponse> => {
    try {
        if (!context.isApiKey)
            throw new GraphQLError(
                "API Key Missing! You're not authorized to edit!"
            )

        console.log(`Template update started for templateId: ${id}`)
        console.log(`data received ${data}`)
        const template = await TemplateModel.findByIdAndUpdate(id, data, {
            new: true
        })
        if (!template) throw new GraphQLError("Template not found")
        return {
            success: true,
            message: "Template update succesfull",
            data: template
        }
    } catch (error: GraphQLError | Error | any) {
        return {
            success: false,
            statusCode: error?.statusCode || 500,
            message: error?.message || "Internal Error"
        }
    }
}

export const updateTemplateBannerImage = async (
    id: string,
    bannerImage: string,
    context: AuthRequestContext
): Promise<TemplateResponse> => {
    try {
        if (context.user?.role != AuthRole.ADMIN)
            throw new GraphQLError("You're not authorized to edit!")

        console.log("info", "Update Template called", bannerImage)
        console.log("bannerImage", bannerImage)
        console.log("id", id)
        const template = await TemplateModel.findById(id)
        if (!template) throw new Error("Template not found")

        const response = await TemplateModel.findByIdAndUpdate(
            id,
            {
                bannerImage
            },
            { new: true }
        )

        if (!response) throw new Error("Template not found")

        return {
            success: true,
            message: "Template updated Successfully",
            data: response
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

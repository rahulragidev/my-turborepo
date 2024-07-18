import checkDomain from "libs/vercel/domain/check-domain"
import checkDomainConfiguration from "libs/vercel/domain/check-domain-configuration"
import checkDomainInformation from "libs/vercel/domain/check-domain-information"
import checkDomainPrice from "libs/vercel/domain/check-domain-price"
import deleteDomainVercel from "libs/vercel/domain/delete-domain"

import purchaseDomainVercel from "libs/vercel/domain/purchase-domain"
import registerOrTransferInDomain from "libs/vercel/domain/register-domain"
import { DomainConfigurationResponse } from "./types/domain-configuration-response.type"
import { DomainInformationResponse } from "./types/domain-information-response.type"
import { DomainPriceResponse } from "./types/domain-price-response.type"
import { DomainRegisterResponse } from "./types/domain-register-response.type"
import { ResponseSchema } from "types/response-schema.type"
import { logger } from "logger"

// Check Domain Status
export const checkDomainStatus = async (
    name: string
): Promise<ResponseSchema> => {
    try {
        const response = await checkDomain(name)
        return {
            success: response.available,
            message: response.available ? "Domain available" : "Domain taken",
            statusCode: 200
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: "Domain check failed" || error.message,
            statusCode: error.code || 500
        }
    }
}

// Get Domain Price
export const getDomainPrice = async (
    name: string
): Promise<DomainPriceResponse> => {
    try {
        const response = await checkDomainPrice(name)
        return {
            success: true,
            data: response
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.error.message || "Price check failed",
            statusCode: error.error.code || 500
        }
    }
}

// Get Domain Information
export const getDomainInformation = async (
    name: string
): Promise<DomainInformationResponse> => {
    try {
        const response = await checkDomainInformation(name)
        return {
            success: true,
            data: response
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.error.message || "Domain information check failed",
            statusCode: error.error.code || 500
        }
    }
}

export const getDomainConfiguration = async (
    domain: string
): Promise<DomainConfigurationResponse> => {
    try {
        const response = await checkDomainConfiguration(domain)
        return {
            success: true,
            data: response
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message:
                error.error.message || "Couldn't get domain's configuration",
            statusCode: error.error.code || 500
        }
    }
}

export const registerDomain = async (
    name: string
): Promise<DomainRegisterResponse> => {
    try {
        const response = await registerOrTransferInDomain(name)
        return {
            success: true,
            data: response
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.error.message || "Domain registration failed"
        }
    }
}

// Purchase Domain
export const purchaseDomain = async (
    name: string,
    expectedPrice?: number,
    renew?: boolean
): Promise<ResponseSchema> => {
    try {
        const response = await purchaseDomainVercel(name, expectedPrice, renew)
        return {
            success: true,
            message: response.message || "Domain Purchased Succesfully",
            statusCode: 200
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.error.message || "Domain purchase failed",
            statusCode: error.error.status || 500
        }
    }
}

// Delete Domain from Vercel

export const deleteDomain = async (domain: string): Promise<ResponseSchema> => {
    try {
        const response = await deleteDomainVercel(domain)
        return {
            success: true,
            message: response.message || "Domain deleted succesfully",
            statusCode: 200
        }
    } catch (error: any) {
        logger.error(error)

        return {
            success: false,
            message: error.error.message || "Domain deletion failed",
            statusCode: error.error.status || 500
        }
    }
}

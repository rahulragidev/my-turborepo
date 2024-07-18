//  Empty page

import * as DomainController from "./domain.controller"
import { Arg, Authorized, Query, Resolver } from "type-graphql"
import { DomainConfigurationResponse } from "./types/domain-configuration-response.type"
import { DomainInformationResponse } from "./types/domain-information-response.type"
import { DomainPriceResponse } from "./types/domain-price-response.type"
import { DomainRegisterResponse } from "./types/domain-register-response.type"
import { ResponseSchema } from "types/response-schema.type"

@Resolver()
export class DomainResolver {
    @Authorized()
    @Query(_returns => ResponseSchema)
    async checkDomainStatus(
        @Arg("name") name: string
    ): Promise<ResponseSchema> {
        return await DomainController.checkDomainStatus(name)
    }

    @Authorized()
    @Query(_returns => DomainPriceResponse)
    async getDomainPrice(
        @Arg("name") name: string
    ): Promise<DomainPriceResponse> {
        return await DomainController.getDomainPrice(name)
    }

    @Authorized()
    @Query(_returns => DomainInformationResponse)
    async getDomainInformation(
        @Arg("name") name: string
    ): Promise<DomainInformationResponse> {
        return await DomainController.getDomainInformation(name)
    }

    @Authorized()
    @Query(_returns => DomainConfigurationResponse)
    async getDomainConfiguration(
        @Arg("domain") domain: string
    ): Promise<DomainConfigurationResponse> {
        return await DomainController.getDomainConfiguration(domain)
    }

    @Authorized()
    @Query(_return => DomainRegisterResponse)
    async registerOrTransferInDomain(
        @Arg("name") name: string
        // @Arg("method") method?: string
    ): Promise<DomainRegisterResponse> {
        return await DomainController.registerDomain(name)
    }

    @Authorized()
    @Query(_return => ResponseSchema)
    async purchaseDomain(
        @Arg("name") name: string,
        @Arg("expectedPrice", { nullable: true }) expectedPrice?: number,
        @Arg("renew", { nullable: true }) renew?: boolean
    ): Promise<ResponseSchema> {
        return await DomainController.purchaseDomain(name, expectedPrice, renew)
    }
}

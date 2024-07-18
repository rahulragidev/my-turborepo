/* eslint-disable no-unused-vars */

import { Field, Int, ObjectType } from "type-graphql"

/** This object contains information related to the pagination of the current request, including the necessary parameters to get the next or previous page of data. */
@ObjectType()
export class Pagination {
    /** Amount of items in the current page. */
    @Field()
    count: number
    /** Timestamp that must be used to request the next page. */
    @Field({ nullable: true })
    next?: number
    /** Timestamp that must be used to request the previous page. */
    @Field({ nullable: true })
    prev?: number
}

@ObjectType({ description: "Domain Response from vercel" })
export class VercelProjectDomain {
    @Field()
    name: string

    @Field()
    apexName: string

    @Field()
    projectId: string

    @Field({ nullable: true })
    redirect?: string

    @Field(_type => Int, { nullable: true })
    redirectStatusCode?: 307 | 301 | 302 | 308

    @Field({ nullable: true })
    gitBranch?: string

    @Field({ nullable: true })
    updatedAt?: number

    @Field({ nullable: true })
    createdAt?: number

    /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
    @Field()
    verified: boolean

    /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
    @Field(_type => [DomainVerification], { nullable: true })
    verification?: DomainVerification[]
}

@ObjectType()
export class DomainVerification {
    @Field()
    type: string

    @Field()
    domain: string

    @Field()
    value: string

    @Field()
    reason: string
}

@ObjectType()
export class VercelProjectDomainsResponse {
    @Field(_type => [VercelProjectDomain], { nullable: true })
    domains?: VercelProjectDomain[]

    @Field(_type => Pagination)
    pagination: Pagination
}

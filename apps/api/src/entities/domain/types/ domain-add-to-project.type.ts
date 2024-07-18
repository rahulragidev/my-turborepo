import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
export class DomainVerficiation {
    @Field()
    type: string
    @Field()
    domain: string
    @Field()
    value: string
    @Field()
    reason: string
}

@ObjectType({ description: "Response from Vercel" })
export class AddDomainToProjectResponse {
    @Field()
    name: string

    @Field()
    apexName: string

    @Field()
    projectId: string

    @Field()
    redirect?: string

    @Field(_type => Int, { nullable: true })
    redirectStatusCode?: (307 | 301 | 302 | 308) | null

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
    @Field(_type => [DomainVerficiation], { nullable: true })
    verification?: DomainVerficiation[]
}

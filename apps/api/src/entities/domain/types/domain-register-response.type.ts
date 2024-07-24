import { DomainCreator } from "./domain-response"
import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
class NewDomain {
    /** If the domain has the ownership verified. */
    @Field()
    verified: boolean
    /** A list of the current nameservers of the domain. */
    @Field(_type => [String])
    nameservers: string[]
    /** A list of the intended nameservers for the domain to point to Vercel DNS. */
    @Field(_type => [String])
    intendedNameservers: string[]
    /** A list of custom nameservers for the domain to point to. Only applies to domains purchased with Vercel. */
    @Field(_type => [String], { nullable: true })
    customNameservers?: string[]
    /** An object containing information of the domain creator, including the user's id, username, and email. */
    @Field(_type => DomainCreator)
    creator: DomainCreator
    /** The unique identifier of the domain. */
    @Field()
    id: string
    /** The domain name. */
    @Field()
    name: string
    /** Timestamp in milliseconds when the domain was created in the registry. */
    @Field()
    createdAt: number
    /** Timestamp in milliseconds at which the domain is set to expire. `null` if not bought with Vercel. */
    @Field({ nullable: true })
    expiresAt?: number
    /** If it was purchased through Vercel, the timestamp in milliseconds when it was purchased. */
    @Field({ nullable: true })
    boughtAt?: number
    /** Timestamp in milliseconds at which the domain was ordered. */
    @Field({ nullable: true })
    orderedAt?: number
    /** Indicates whether the domain is set to automatically renew. */
    @Field()
    renew?: boolean
    /** The type of service the domain is handled by. `external` if the DNS is externally handled, `zeit.world` if handled with Vercel, or `na` if the service is not available. */
    @Field()
    serviceType: "zeit.world" | "external" | "na"
    /** Timestamp in milliseconds at which the domain was successfully transferred into Vercel. `null` if the transfer is still processing or was never transferred in. */
    @Field({ nullable: true })
    transferredAt?: number
    /** If transferred into Vercel, timestamp in milliseconds when the domain transfer was initiated. */
    @Field({ nullable: true })
    transferStartedAt?: number
}

@ObjectType()
class ResponseInterface {
    @Field(_type => NewDomain, { nullable: true })
    domain?: NewDomain
}

@ObjectType({ description: "Domain Information" })
export class DomainRegisterResponse extends ResponseSchema {
    @Field(_type => ResponseInterface)
    declare data?: ResponseInterface
}

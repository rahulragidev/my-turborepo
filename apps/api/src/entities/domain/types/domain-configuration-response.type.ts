import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

/**
 * FOR LATER
 * ===========
 * Actual Interface is more strict
 * But I don't have time so I'm putting the acceptingChallenges and ConfiguredBy as strings for now. 
 * So yeah, Fuck it Lol
 * 
 * Here's the actual Interface from Vercel Docs:
 * interface Response {
        // How we see the domain's configuration. - `CNAME`: Domain has a CNAME pointing to Vercel. - `A`: Domain's A record is resolving to Vercel. - `http`: Domain is resolving to Vercel but may be behind a Proxy. - `null`: Domain is not resolving to Vercel. 
        configuredBy?: ("CNAME" | "A" | "http") | null
        // Which challenge types the domain can use for issuing certs
        acceptedChallenges?: ("dns-01" | "http-01")[]
        // Whether or not the domain is configured AND we can automatically generate a TLS certificate.
        misconfigured: boolean
    }
 */

@ObjectType()
export class DomainConfigurationInterface {
    /** How we see the domain's configuration. - `CNAME`: Domain has a CNAME pointing to Vercel. - `A`: Domain's A record is resolving to Vercel. - `http`: Domain is resolving to Vercel but may be behind a Proxy. - `null`: Domain is not resolving to Vercel. */
    @Field(_type => String, { nullable: true })
    configuredBy?: ("CNAME" | "A" | "http") | null
    /** Which challenge types the domain can use for issuing certs. */
    @Field(_type => [String], { nullable: true })
    acceptedChallenges?: ("dns-01" | "http-01")[]
    /** Whether or not the domain is configured AND we can automatically generate a TLS certificate. */
    @Field()
    misconfigured: boolean
}

@ObjectType({ description: "Domain Configuration Response" })
export class DomainConfigurationResponse extends ResponseSchema {
    @Field(_type => DomainConfigurationInterface, { nullable: true })
    declare data?: DomainConfigurationInterface
}

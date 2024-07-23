import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { VercelProjectDomainsResponse } from "./vercel-domain.response"

@ObjectType()
export class SiteDomainsResponse extends ResponseSchema {
    @Field(_type => VercelProjectDomainsResponse, { nullable: true })
    data?: VercelProjectDomainsResponse
}

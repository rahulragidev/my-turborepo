import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { SiteStatus } from "./site-status.response"

@ObjectType({ description: "Create Sites Response" })
export class DeploySiteResponse extends ResponseSchema {
    @Field({ nullable: true })
    siteId?: string

    @Field(_type => SiteStatus, { nullable: true })
    status?: SiteStatus
}

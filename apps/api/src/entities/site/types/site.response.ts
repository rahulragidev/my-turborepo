import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { Site } from "../site.type"

@ObjectType({ description: "Site Response" })
export class SiteResponse extends ResponseSchema {
    @Field(_type => Site, { nullable: true })
    data?: Site
}

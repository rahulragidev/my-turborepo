import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { Site } from "../site.type"

@ObjectType({ description: "Sites Response" })
export class SitesResponse extends ResponseSchema {
    @Field(_type => [Site], { nullable: true })
    declare data?: Site[]
}

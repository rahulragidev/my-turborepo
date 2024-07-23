import { Field, ObjectType } from "type-graphql"
import { Page } from "../page.type"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
export class PagesResponse extends ResponseSchema {
    @Field(_type => [Page], { nullable: true })
    data?: Page[]
}

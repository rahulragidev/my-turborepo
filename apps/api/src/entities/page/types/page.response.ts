import { Field, ObjectType } from "type-graphql"
import { Page } from "../page.type"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
export class PageResponse extends ResponseSchema {
    @Field(_type => Page, { nullable: true })
    declare data?: Page
}

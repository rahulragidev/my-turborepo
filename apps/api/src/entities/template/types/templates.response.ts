import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { Template } from "../template.type"

@ObjectType({ description: "Template Response" })
export class TemplatesResponse extends ResponseSchema {
    @Field(_type => [Template], { nullable: true })
    declare data?: Template[]
}

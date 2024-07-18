import { Asset } from "../asset.type"
import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
export class AssetsResponse extends ResponseSchema {
    @Field(_type => [Asset], { nullable: true })
    assets?: Asset[]
}

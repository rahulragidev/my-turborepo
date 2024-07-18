import { Asset } from "../asset.type"
import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
export class AssetResponse extends ResponseSchema {
    @Field(_type => Asset, { nullable: true })
    asset?: Asset
}

import GraphQLJSON from "graphql-type-json"
import { Asset } from "entities/asset/asset.type"
import { Field, ID, InputType } from "type-graphql"
import { Page } from "../page.type"
import type { Ref } from "@typegoose/typegoose"

@InputType()
export class UpdatePageInput implements Partial<Page> {
    @Field(_type => GraphQLJSON, { nullable: true })
    jsonDraftBody?: JSON

    @Field({ nullable: true })
    draftBody?: string

    @Field(_type => ID, { nullable: true })
    bannerImage?: Ref<Asset>

    @Field({ nullable: true })
    metaTitle?: string

    @Field({ nullable: true })
    metaDescription?: string

    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    slug?: string

    @Field({ nullable: true })
    isFeatured?: boolean
}

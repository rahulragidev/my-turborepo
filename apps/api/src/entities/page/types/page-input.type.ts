import GraphQLJSON from "graphql-type-json"
import { Asset } from "../../asset/asset.type"
import { Field, ID } from "type-graphql"
import { Page } from "../page.type"
import { Site } from "../../site/site.type"
import type { Ref } from "@typegoose/typegoose"

export class PageInput implements Partial<Page> {
    @Field(_type => ID)
    siteId?: Ref<Site>

    @Field()
    name: string

    @Field()
    body: string

    @Field()
    draftBody: string

    @Field(_type => GraphQLJSON, { nullable: true })
    jsonDraftBody?: any

    @Field()
    isPublic: boolean

    @Field(_type => ID, { nullable: true })
    bannerImage?: Ref<Asset>
}

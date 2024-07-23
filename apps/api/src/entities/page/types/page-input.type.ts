import GraphQLJSON from "graphql-type-json"
import { Asset } from "entities/asset/asset.type"
import { Field, ID } from "type-graphql"
import { Page } from "../page.type"
import { Ref } from "@typegoose/typegoose"
import { Site } from "entities/site/site.type"

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

import { Asset } from "entities/asset/asset.type"
import { Field, ID, ObjectType } from "type-graphql"
import { Page } from "entities/page/page.type"
import { Prop, Ref, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { Site } from "entities/site/site.type"

@ObjectType({ description: "SEO" })
@modelOptions({ schemaOptions: { timestamps: true } })
export class SEO {
    @Field(_type => ID)
    readonly id!: string

    @Field(_type => Site)
    @Prop({ ref: "Site", required: true })
    site: Ref<Site>

    @Field(_type => Page, { nullable: true })
    @Prop({ ref: "Page" })
    page?: Ref<Page>

    @Field()
    @Prop({ required: true })
    title: string

    @Field()
    @Prop()
    description?: string

    @Field(_type => [String], { nullable: true })
    @Prop()
    keywords?: string[]

    @Field(_type => String, { nullable: true })
    @Prop({ ref: "Asset" })
    image?: Ref<Asset>
}

export const SEOModel = getModelForClass(SEO)

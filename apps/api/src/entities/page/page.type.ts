import GraphQLJSON from "graphql-type-json"
import { Asset } from "entities/asset/asset.type"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { IsAlpha, IsLowercase } from "class-validator"
import { Pre, Prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { Site } from "entities/site/site.type"
import { User } from "entities/user/user.type"
import type { Ref } from "@typegoose/typegoose"

function sanitize(text: string) {
    return text
        .trim()
        .replaceAll(/[^\w\s-_]+/g, "") // remove all special characters
        .replaceAll(/\s+/g, "-") // replace all spaces with dashes
        .replaceAll(/[_-]$/g, "") // remove trailing underscores and dashes
}

@ObjectType({ description: "Page" })
@Pre<Page>("save", function () {
    if (this.draftBody === "") {
        this.draftBody = this.body
    }
    if (this.jsonDraftBody === null) {
        this.jsonDraftBody = this.jsonBody
    }
})
@Pre<Page>("save", function () {
    this.slug = !this.slug ? sanitize(this.name) : sanitize(this.slug)
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class Page {
    @Field(_type => ID)
    readonly id!: string

    @Field()
    @Prop({ required: true })
    @IsAlpha()
    @IsLowercase()
    name: string

    @Field()
    @Prop({ required: true })
    @IsLowercase()
    slug: string

    @Field({ defaultValue: false })
    @Prop({ default: false })
    isPublic?: boolean

    @Field(_type => ID)
    @Prop({ ref: "Site", required: true })
    site: Ref<Site>

    @Field(_type => ID)
    @Prop({ ref: "User", required: true })
    owner: Ref<User>

    @Field(_type => Int)
    @Prop({ default: 0 })
    priority: number

    @Field()
    @Prop({ default: false })
    isFeatured: boolean

    // OptionAl BannerImage
    @Field(_type => Asset, { nullable: true })
    @Prop({ ref: "Asset", required: false })
    bannerImage?: Ref<Asset>

    @Field({ defaultValue: "" })
    @Prop({ default: "" })
    body: string

    @Field({ defaultValue: "", nullable: true })
    @Prop({ default: "" })
    draftBody?: string

    @Field(_type => GraphQLJSON, { defaultValue: null, nullable: true })
    @Prop({ default: null, nullable: true })
    jsonDraftBody: any

    @Field(_type => GraphQLJSON, { defaultValue: null, nullable: true })
    @Prop({ default: null, nullable: true })
    jsonBody: any

    // @Field(_type => SEO, { nullable: true })
    // @Prop({ ref: "SEO" })
    // seo?: Ref<SEO>

    @Field({ nullable: true })
    @Prop({ required: false })
    metaTitle?: string

    @Field({ nullable: true })
    @Prop({ required: false })
    metaDescription?: string

    @Field(_type => [Page])
    @Prop({ ref: "Page", default: [] })
    children?: Ref<Page>[]

    @Field(_type => Page, { nullable: true })
    @Prop({ ref: "Page", required: false })
    parent?: Ref<Page> | null

    @Field(_type => Date)
    readonly createdAt!: Date

    @Field(_type => Date)
    readonly updatedAt!: Date

    @Field(_type => Date, { nullable: true })
    @Prop({ required: false })
    lastPublishedAt?: Date

    // @IsLowercase()
    // @Field({ defaultValue: "mx-auto max-w-6xl w-full" })
    // @Prop({ default: "mx-auto max-w-6xl w-full" })
    // containerClass?: string

    // @IsLowercase()
    // @Field({ defaultValue: "mx-auto max-w-6xl w-full" })
    // @Prop({ default: "mx-auto max-w-6xl w-full" })
    // headerContainerClass?: string

    // @IsLowercase()
    // @Field({ defaultValue: "mx-auto max-w-6xl w-full" })
    // @Prop({ default: "mx-auto max-w-6xl w-full" })
    // footerContainerClass?: string
}

export const PageModel = getModelForClass(Page)

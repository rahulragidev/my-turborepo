import unslugify from "utils/unslugify"
import { Asset } from "entities/asset/asset.type"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Page } from "entities/page/page.type"
import {
    Ref,
    getModelForClass,
    modelOptions,
    post,
    pre,
    prop
} from "@typegoose/typegoose"
import { Template } from "entities/template/template.type"
import { User } from "entities/user/user.type"
import { VercelProjectDomain } from "./types/vercel-domain.response"
import { reservedNames } from "utils/reserved-names"
// import { Types } from "mongoose"
/**
 * Site in Lokus <=> Project in Vercel
 * Site is used synonmysouly for Project in vercel
 * Site stores the necessary values needed from Vercel Project in our DB.
 * Otherwise we fetch the additional details as they're required rom the Project api from Vercel.
 */

@pre<Site>("save", async function (next) {
    if (!this.textLogo || this.textLogo.trim() === "") {
        this.textLogo = this.slug.split("-")?.[0] ?? this.slug
    }
    if (this.slug && this.slug.trim() === "") {
        this.name = this.slug
    }
    next()
})
@pre<Site>("save", async function (next) {
    // check if the slug is * or api or admin or app, if yes reject save
    if (this.slug && reservedNames.includes(this.slug)) {
        throw new Error("Name is reserved")
    }
    next()
})
@post<Site>("save", async function () {
    // Make slug as the name
    if (this.slug) {
        this.name = unslugify(this.slug)
    }
})
@modelOptions({ schemaOptions: { timestamps: true } })
@ObjectType()
export class Site {
    @Field(_type => ID)
    readonly id!: string

    @Field({ nullable: true })
    @prop({ required: false, sparse: true })
    name: string

    // prevent this from being any of the reserved names
    @Field()
    @prop({ required: true, unique: true })
    slug: string

    @Field(_type => User)
    @prop({ ref: "User", required: true })
    owner!: Ref<User>

    @Field(_type => ID)
    @prop({
        ref: "Template",
        required: true,
        default: "635e2719eb8e4174ebc9998a"
    })
    template!: Ref<Template>

    @Field(_type => Int)
    @prop({ default: 0 })
    setup?: number // default: 0 => not started, 1 => first step,

    @Field(_type => [Page], { nullable: true })
    @prop({ ref: "Page" })
    pages?: Ref<Page[]>

    @Field({ nullable: true })
    @prop({ unique: true, required: false, sparse: true })
    vercelProjectId?: string

    @Field({ nullable: true })
    url?: string

    @Field(_type => [VercelProjectDomain], { nullable: true })
    @prop()
    customDomain?: VercelProjectDomain[]

    @Field({ nullable: true })
    @prop()
    primaryDomain?: string

    @Field({ nullable: true })
    @prop()
    productId?: string

    @Field({ nullable: true })
    @prop({ default: "text" })
    logoPreference?: "text" | "image"

    @Field({ nullable: true })
    @prop()
    textLogo?: string

    @Field(_type => Asset, { nullable: true })
    @prop({ ref: "Asset", required: false })
    desktopLogo?: Ref<Asset>

    @Field(_type => Asset, { nullable: true })
    @prop({ ref: "Asset", required: false })
    mobileLogo?: Ref<Asset>

    @Field(_type => Date)
    readonly createdAt!: Date

    @Field(_type => Date)
    readonly updatedAt!: Date
}

export const SiteModel = getModelForClass(Site)

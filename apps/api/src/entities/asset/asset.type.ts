import { Field, ID, ObjectType } from "type-graphql"
import { Prop, Ref, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { User } from "entities/user/user.type"

@ObjectType({ description: "Asset" })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Asset {
    @Field(_type => ID)
    readonly id!: string

    @Field(_type => User)
    @Prop({ ref: "User", required: true })
    owner: Ref<User>

    @Field({ nullable: true })
    @Prop({ unique: true, sparse: true })
    cloudfareId?: string

    // This is the variants array from Cloudflare Images
    @Field(_type => [String])
    @Prop({ unique: true })
    variants: string[]

    @Field({ description: "This is the key from the bucket" })
    @Prop({ unique: true, sparse: true })
    key?: string

    // This is the fileName from cloudFlare
    @Field()
    @Prop({ required: true })
    originalFileName: string

    //TODO: Make it more opinionated
    @Field()
    @Prop()
    mimeType?: string

    @Field()
    @Prop()
    size: number

    @Field()
    @Prop({ default: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" })
    blurhash: string

    @Field({ nullable: true })
    @Prop()
    height?: number

    @Field({ nullable: true })
    @Prop()
    width?: number

    // This field is used to check if the asset is still in use by the user.
    @Field(_type => String, { nullable: true })
    @Prop()
    lastReferenceCheckedAt?: Date
}

export const AssetModel = getModelForClass(Asset)

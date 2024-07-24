import { Field, ID, ObjectType } from "type-graphql"
import { FrameworkEnum } from "./types/framework.enum"
import { GitRepository } from "./types/git-repository.type"
import { StripeProduct } from "./types/stripe-product.type"
import { User } from "entities/user/user.type"
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"

@ObjectType({ description: "Template" })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Template {
    @Field(_type => ID)
    readonly id!: string

    @Field()
    @prop({ unique: true, required: true })
    name: string

    @Field({ nullable: true })
    @prop({ required: false })
    bannerImage?: string

    @Field({ nullable: true })
    @prop({
        validate: {
            validator: function (v: string) {
                const urlRegex =
                    /^(http|https):\/\/(?:www\.)?[\w#%+.:=@~-]{2,256}\.[a-z]{2,6}\b([\w#%&+./:=?@~-]*)$/
                return urlRegex.test(v)
            },
            message: "DEMO_LINK_IS_NOT_A_VALID_URL"
        },
        nullable: true
    })
    demoLink?: string

    @Field(_type => StripeProduct, {
        nullable: true,
        description: "The Product from Stripe"
    })
    @prop()
    stripeProduct?: string

    @Field(_type => GitRepository)
    @prop({ required: true })
    gitSource: GitRepository

    @Field({ nullable: true })
    @prop()
    description?: string

    @Field(_type => ID, { nullable: true })
    @prop({ ref: "User", required: false })
    creator?: Ref<User>

    @Field(_type => FrameworkEnum, { defaultValue: FrameworkEnum.NEXTJS })
    @prop({ enum: FrameworkEnum, defaultValue: FrameworkEnum.NEXTJS })
    framework: FrameworkEnum

    @Field(_type => Date)
    readonly createdAt!: Date

    @Field(_type => Date)
    readonly updatedAt!: Date
}

export const TemplateModel = getModelForClass(Template)

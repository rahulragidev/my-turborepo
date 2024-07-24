import { Field, ID, Int, ObjectType } from "type-graphql"
import { IsCurrency } from "class-validator"
import { Prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { Site } from "../../entities/site/site.type"
import { User } from "../../entities/user/user.type"
import type { Ref } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
@ObjectType()
export class Subscription {
    // A unique identifier for the subscription
    @Field(_type => ID)
    readonly id!: string

    // The ID of the customer who owns the subscription
    // (optional) cause we need to create a subscription before attaching to a user
    @Field()
    @Prop({ ref: "User" })
    user?: Ref<User>

    // The ID of the subscription on the payment platform (e.g. Stripe)
    @Field()
    @Prop({ required: true })
    subscriptionId!: string

    // The site ID associated with the subscription
    @Field(_type => ID)
    @Prop({ ref: "Site", required: true })
    siteId!: Ref<Site>

    // The date the subscription started
    @Field(_type => Date)
    @Prop({ required: true })
    startDate!: Date

    // The date the subscription will end
    @Field(_type => Date)
    @Prop({ required: true })
    endDate!: Date

    // Whether the subscription has been cancelled
    @Field(_type => Boolean)
    @Prop({ default: false })
    isCancelled?: boolean

    // An array of payment methods (e.g. card IDs) associated with the subscription
    @Field(_type => [String], { nullable: true })
    @Prop()
    paymentMethods?: string[]

    // The amount of the subscription payment in the smallest unit of the currency (e.g. cents for USD)
    @Field(_type => Int)
    @Prop({ required: true })
    amount!: number

    // The currency of the subscription payment (e.g. "USD")
    @IsCurrency()
    @Field(_type => String)
    @Prop({ required: true, default: "USD" })
    currency!: string

    // The start date of the trial period (if applicable)
    @Field(_type => Date, { nullable: true })
    @Prop()
    trialStartDate?: Date

    // The end date of the trial period (if applicable)
    @Field(_type => Date, { nullable: true })
    @Prop()
    trialEndDate?: Date

    // The date the subscription was created
    @Field(_type => Date)
    readonly createdAt!: Date

    // The date the subscription was last updated
    @Field(_type => Date)
    readonly updatedAt!: Date
}

// Export the model created from the class
export const SubscriptionModel = getModelForClass(Subscription)

import StripeSubscription from "./types/stripe-subscription.type"

import { AuthRole } from "auth/roles"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { IsEmail, isEmail } from "class-validator"
import {
    Pre,
    // Ref,
    Prop,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose"
import { Site } from "../../entities/site/site.type"
// import { isEmail, isPhoneNumber } from "class-validator"
// import { user_uid } from "lib/uid"
// import { nanoid } from 'nanoid'
import type { Ref } from "@typegoose/typegoose"

@ObjectType({ description: "User model" })
@Pre<User>("save", async function () {
    console.log("User created")
    // const _signUpDate = DateTime.fromISO(this.createdAt)

    // this.trialExpires = signUpDate.add(7)
})
// To add timestamps
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
    @Field(_type => ID)
    readonly id!: string

    @Field(_type => AuthRole)
    @prop({ enum: AuthRole, default: AuthRole.USER })
    role?: AuthRole

    @Field({ nullable: true })
    @prop()
    name?: string

    @Field()
    @prop({ unique: true, validate: isEmail })
    @IsEmail()
    email!: string

    @Field(_type => Int, { defaultValue: -1 })
    @prop({ default: -1 }) // -1 means didn't begin
    onboardingState: number

    @Field(_type => [Site], { nullable: true })
    @Prop({ ref: "site" })
    sites?: Ref<Site[]>

    @Field(_type => StripeSubscription, { nullable: true })
    subscription?: StripeSubscription | null

    @Field(_type => Date)
    readonly createdAt!: Date

    @Field(_type => Date)
    readonly updatedAt!: Date
}

export const UserModel = getModelForClass(User)

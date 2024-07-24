import * as UserController from "./user.controller"
import StripeSubscription from "./types/stripe-subscription.type"
import getStripeSubscriptionByEmail from "libs/stripe/get-stripe-subscription-by-email"

import Stripe from "stripe"
import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql"
import { Site, SiteModel } from "entities/site/site.type"
import { UpdateUserInput } from "./types/update-user.input"
import { User, UserModel } from "./user.type"
import { UserInput } from "./types/user.input"
import { UserResponse } from "./types/user.response"
import { logger } from "logger"
import { revalidationSecretKey } from "config"
import type { AuthRequestContext } from "auth/request-context"
import type { DocumentType } from "@typegoose/typegoose"

@Resolver(_of => User)
export class UserResolver {
    @FieldResolver()
    async sites(@Root() user: DocumentType<User>): Promise<Site[]> {
        return await SiteModel.find({ owner: user.id })
    }

    @FieldResolver(_type => StripeSubscription, { nullable: true })
    async subscription(
        @Root() user: DocumentType<User>
    ): Promise<StripeSubscription | null> {
        // Makes a call to Stripe to get the subscription
        return await getStripeSubscriptionByEmail(user.email)
    }

    @Authorized()
    @Query(_returns => UserResponse)
    async me(@Ctx() context: AuthRequestContext): Promise<UserResponse> {
        try {
            // console.log("Looking for user with id", context.user!.email)
            const user = await UserModel.findOne({ email: context.user!.email })

            return {
                success: true,
                message: "user found",
                data: user!
            }
        } catch (error: any) {
            console.log(`Error at userResolver \n ${error}`)
            return {
                success: false,
                message: error.message,
                statusCode: error.statusCode || 500
            }
        }
    }

    @Authorized()
    @Query(_returns => String, { nullable: true })
    async checkUser(
        @Arg("email") email: string,
        @Ctx() context: AuthRequestContext
    ): Promise<string | null> {
        return await UserController.checkUser(email, context)
    }

    @Query(_returns => String, { nullable: true })
    async checkSubscription(
        @Arg("email") email: string,
        @Arg("secretKey") secretKey: string
    ): Promise<Stripe.Subscription.Status | null> {
        try {
            if (secretKey !== revalidationSecretKey) {
                throw new Error("Invalid secret key")
            }
            const subscription = await getStripeSubscriptionByEmail(email)
            if (!subscription) {
                return null
            }
            return subscription.status
        } catch (error: any) {
            logger.error(`Error at userResolver \n ${error}`)
            return null
        }
    }

    @Authorized()
    @Mutation(_returns => UserResponse)
    async createUser(
        @Arg("data") data: UserInput,
        @Ctx() context: AuthRequestContext
    ): Promise<UserResponse> {
        return await UserController.createUser(data, context)
    }

    @Authorized()
    @Mutation(_returns => UserResponse)
    async updateUser(
        @Arg("data") data: UpdateUserInput,
        @Ctx() context: AuthRequestContext
    ): Promise<UserResponse> {
        return await UserController.updateUser(data, context)
    }
}

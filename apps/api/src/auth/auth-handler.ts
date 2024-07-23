import * as jwt from "auth/jwt"

import { AuthChecker } from "type-graphql"
import { AuthRequestContext } from "auth/request-context"
import { UserModel } from "entities/user/user.type"
import { apiKey } from "config"
import type { Context as KoaContext } from "koa"

/**
 * This function gets called by Apollo on each mutation/query/... with the `@Authorized` annotation.
 * You can pass additional arguments (Roles) as param to `@Authorized`
 *
 * @param param0 the context object
 * @param roles provided roles (optional array param in `@Authorized()`)
 */
export const authChecker: AuthChecker<AuthRequestContext> = (
    { context },
    roles
) => {
    if (context.isApiKey) return true
    if (!context.isAuthenticated) return false

    if (roles.length === 0) return true

    // console.log('roles', roles)
    // console.log('user', context.user)
    // console.log('user role', context.user!.role)
    // console.log('includes', roles.includes(context.user!.role))

    return roles.includes(context.user!.role)
    //  return roles.includes(context.user?.role.toString() as string) // TODO: add role implementation (moderator, admin, ...?)
}

/**
 * This is basically a koa middleware that checks for an `Authorization` header on each requests
 * The following steps are performed:
 * 1. Check if Authorization header is present
 * 2. If so, the provided token gets decrypted and the `tokenData` gets casted into `AuthRequestContext` type
 *
 * @param param0 Koa Context object
 * @returns `AuthRequestContext` that gets added to each Koa context object
 * `AuthRequestContext` can be retrieved by adding `@Ctx() context: AuthRequestContext` to any mutation/query/...
 */
export const authHandler = async ({
    ctx
}: {
    ctx: KoaContext
}): Promise<AuthRequestContext> => {
    const token =
        ctx.request?.headers?.authorization?.replace(/bearer/gi, "").trim() ||
        ""

    if (token === apiKey) {
        return {
            isAuthenticated: true,
            isApiKey: true
        }
    }

    if (token) {
        try {
            const tokenData = jwt.decrypt(token)
            // console.log(`tokenData ${JSON.stringify(tokenData, null, 2)}`)
            let user = null

            if (tokenData.email) {
                // check if userExists, find user by email
                user = await UserModel.findOne({ email: tokenData.email })

                // if user doesn't exits, create new user
                if (!user) {
                    console.log("Creating new user")
                    // create new user
                    user = await UserModel.create({
                        email: tokenData.email,
                        role: tokenData.role,
                        name: "New User"
                    })
                    console.log("Created a new user")
                }

                // add user.id to tokenData
                tokenData.id = user.id
            }
            // TODO: see if tokenData has write: true and then create write
            // Authentication otherwise only applies to read / get endPoints
            return {
                isAuthenticated: true,
                isExpired: false,
                token,
                user: {
                    email: tokenData.email,
                    role: tokenData.role,
                    id: tokenData.id
                },
                write: tokenData.write
            }
        } catch (error: any) {
            console.log(`Error while authentication: ${error.message}`)
            if (error.name === "TokenExpiredError") {
                return {
                    token,
                    isAuthenticated: false,
                    isExpired: true
                }
            }
            return { token, isAuthenticated: false }
        }
    }

    return { isAuthenticated: false }
}

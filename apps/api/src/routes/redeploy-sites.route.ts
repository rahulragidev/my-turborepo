//  endpoint to check if server is up. Should respond with OK and status 200 if it's okay. Other 500 or 400

import Koa, { Context } from "koa"
import Router from "@koa/router"
import koaBody from "koa-body"
import { deployAllSitesByTemplate } from "entities/site/site.controller"

const withBody = koaBody({
    json: true
})

export const redploysitesRouter = new Router()

const adminAuth = async (context: Context, next: Koa.Next) => {
    const adminApiKey = process.env.ADMIN_API_KEY
    const requestApiKey = context.headers["authorization"]

    if (requestApiKey !== adminApiKey) {
        context.status = 401
        context.body = { message: "Unauthorized; Admin API Key Required" }
    } else {
        await next()
    }
}

redploysitesRouter.post(
    "/redeployallsites",
    adminAuth,
    withBody,
    async (context: Context, next: Koa.Next) => {
        console.log("redeployallsites", context.request.body)
        // @ts-expect-error because we don't have the type
        if (!context.request.body?.templateId) {
            context.status = 400
            context.body = { message: "templateId is required" }
            return await next()
        }
        const result = await deployAllSitesByTemplate(
            // @ts-expect-error because we don't have the type
            context.request.body?.templateId
        )
        // const result = `trigger to redeploy all sites with templateId: ${context.request.body?.templateId} sent`
        context.body = result
        await next()
    }
)

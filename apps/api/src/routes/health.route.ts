//  endpoint to check if server is up. Should respond with OK and status 200 if it's okay. Other 500 or 400
//  if it's not okay

import Router from "@koa/router"

export const healthRouter = new Router()

healthRouter.get("/health", async context => {
    context.status = 200
    context.body = "OK"
})

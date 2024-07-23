import Koa from "koa"
import cors from "@koa/cors"
import jwt from "jsonwebtoken"

import ratelimit from "koa-ratelimit"
import { ApolloServer } from "apollo-server-koa"
import { AuthRole } from "auth/roles"
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache"
import { __production__, jwtSecret, port } from "./config"
import { authChecker, authHandler } from "auth/auth-handler"
import { buildSchema } from "type-graphql"
import { connectToMongo } from "database/mongo"
import { healthRouter } from "routes/health.route"
import { logger, pinoKoa } from "./logger"
import { redploysitesRouter } from "routes/redeploy-sites.route"
import { resolvers } from "entities/resolvers"
import { router as uploadRouter } from "routes/upload.route"

const app = new Koa()

export const main = async () => {
    try {
        // Connect to DB
        await connectToMongo()

        // Build the schema using type-graphql
        const schema = await buildSchema({
            resolvers: resolvers,
            emitSchemaFile: !__production__,
            authChecker: authChecker,
            validate: {
                forbidUnknownValues: false
            },
            authMode: __production__ ? "error" : "error" // TODO: set to none?
        })

        const server = new ApolloServer({
            cache: new InMemoryLRUCache(),
            introspection: true,
            schema,
            // pass the context to the custom authHandler function
            context: authHandler
        })

        app.use(pinoKoa())

        // Apply all middlewares here
        app.use(
            ratelimit({
                // driver: __production__ ? "redis" : "memory",
                // db: __production__ ? connectRedis() : new Map(),
                driver: "memory",
                db: new Map(),
                duration: 60000,
                errorMessage: "Please slow down your requests",
                id: context => context.ip,
                headers: {
                    remaining: "Rate-Limit-Remaining",
                    reset: "Rate-Limit-Reset",
                    total: "Rate-Limit-Total"
                },
                max: 100,
                disableHeader: true, // TODO: set this to `true` or to `false`?
                whitelist: _context => {
                    // Return true to allow the request without rate limiting,
                    // or false to apply the rate limit.
                    return false
                }
            })
        )

        app.use(
            cors({
                allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS"
                // origin: ctx => ctx.get("origin")
            })
        )

        app.use(healthRouter.routes())
        app.use(healthRouter.allowedMethods())
        app.use(uploadRouter.routes())
        app.use(uploadRouter.allowedMethods())
        app.use(redploysitesRouter.routes())
        app.use(redploysitesRouter.allowedMethods())
        // Starting the server
        await server.start()
        app.use(server.getMiddleware())

        // Write JWT
        // TODO: Remove this in production
        const writableJWT = jwt.sign(
            {
                // TODO: replace this with loggedIn github email?
                email: "praneeth@clearcut.design",
                id: "605312dca9159a5ab0f7714a",
                role: AuthRole.ADMIN,
                write: true,
                env: "dev"
            },
            jwtSecret,
            { algorithm: "HS512" }
        )

        app.listen(port, () => {
            logger.info(
                `Server running at http://localhost:${port}${server.graphqlPath}`
            )
            logger.log({ writableJWT }, "Writable JWT")
        })

        /**
         * DB Scripts
         * 🚫 DANGER ZONE 🚫
         * Try not to run these scripts unless you know what you are doing
         *
         */
        // deleteAllTestSites()
        // addTextLogoNames()
        // normalizeSiteNames()
        // normalizeSlugs()
        // normalizePagesPriority()
        // populateSiteDomains
        // populateSiteDomains()
        // updateHeaderPagesForOldSites()
        // updateShowInHeaderForAllPages()
        // getIndexes()
        // getTemplatesIndexes()
        // dropIndexes()
        // deleteTestTemplates()
        // await deleteAssets({ key: { $exists: false } })
        // await reindexAssets()
        // await rootPageNormalization()
        // await countAllRootPagesAndChildren()
        // await getAllSitesAndRootPages()
        // await reindexSites()
        // 659a58902234c4862d22b400
        // 6534b5cb20dc4c49fba2b7cf
        // await getSiteCount({ templateId: "659a58902234c4862d22b400" })
    } catch (error) {
        logger.fatal(error)
    }
}

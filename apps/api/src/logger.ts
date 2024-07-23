import pino from "pino"
import pinoHTTP from "pino-http"
import { type Middleware } from "koa"

const LOG_LEVEL = process.env.LOG_LEVEL || "trace"

export const logger = pino<"log">({
    level: LOG_LEVEL,
    customLevels: {
        log: pino.levels.values.debug
    }
})

logger.log({ log_level: logger.level }, "🚀 Logger initialized")

export const http_logger = pinoHTTP({
    logger,
    useLevel: "trace"
})

export function pinoKoa() {
    const m: Middleware = async (context, next) => {
        http_logger(context.req, context.res)

        try {
            return await next()
        } catch (error) {
            logger.error(error, `Error:`)
            throw error
        }
    }

    return m
}

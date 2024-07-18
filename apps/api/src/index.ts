import "reflect-metadata"
import { config } from "dotenv"
// import Redis from "ioredis"
//

config()

import { main } from "app"
main()

// const { REDIS_URL, REDIS_PORT } = process.env

// const renderRedis = new Redis({
//     host: REDIS_URL as string,
//     port: parseInt(REDIS_PORT as string) || 6379
// })

// console.log("Connected to Redis! 🚀")

// renderRedis.set("foo", "bar")

// renderRedis.get("foo").then(result => {
//     console.log(`result ${result}`)
// })

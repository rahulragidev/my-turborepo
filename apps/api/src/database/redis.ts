import Redis from "ioredis"
import { redisPort, redisUrl } from "config"

const redis = async () => {
    try {
        const renderRedis = new Redis({
            host: redisUrl,
            port: parseInt(redisPort)
        })
        if (renderRedis.status === "connecting") {
            console.log("Connecting to Redis...")
        }
        return await renderRedis.connect()
    } catch (error) {
        console.error("Error connecting to Redis", error)
        throw error
    } finally {
        console.log("Connected to Redis! 🚀")
    }
}

export default redis

import mongoose from "mongoose"
import { currentEnvironment, mongoUri } from "config"

export const connectToMongo = (): Promise<typeof mongoose> => {
    try {
        const database = mongoose.connect(mongoUri, {
            // dbName: __test__ ? "test" : "development", // TODO: Production task
            dbName: currentEnvironment
        })
        return database
    } catch (error) {
        console.error("Error connecting to MongoDB", error)
        throw error
    }
}

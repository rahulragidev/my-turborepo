export const port = (process.env.PORT as unknown as number) || 4000
export const currentEnvironment = process.env.NODE_ENV || "development"
export const __development__: boolean = process.env.NODE_ENV === "development"
export const __production__: boolean = process.env.NODE_ENV === "production"
export const __test__: boolean = process.env.NODE_ENV === "test"
export const jwtSecret: string = process.env.JWT_SECRET || "supersecretsecret"
export const mongoUri: string = process.env.MONGODB_URI as string
export const apiKey: string = process.env.ADMIN_API_KEY as string
export const cloudflareR2Token: string = process.env
    .CLOUDFLARE_R2_TOKEN as string
export const cloudflareDefaultEndpoint = process.env
    .CLOUDFLARE_DEFAULT_ENDPOINT as string
export const s3AccessKey: string = process.env.S3_ACCESS_KEY as string
export const s3AccessKeyId: string = process.env.S3_ACCESS_KEY_ID as string
export const VercelAccessToken: string = process.env
    .VERCEL_ACCESS_TOKEN as string
export const VercelTeamId: string = process.env.VERCEL_TEAM_ID as string
export const publicGraphQlEndpoint: string = process.env
    .PUBLIC_GRAPHQL_ENDPOINT as string
export const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string
export const logLevel: string = process.env.LOG_LEVEL || "info"
export const defaultStripeProductId: string =
    process.env.NODE_ENV === "production"
        ? "prod_OIW0EWh8F0avSS" // production product
        : "prod_OIW0EWh8F0avSS" // test product
export const redisPort = process.env.REDIS_PORT as string
export const redisUrl = process.env.REDIS_URL as string
export const revalidationSecretKey = process.env
    .REVALIDATION_SECRET_KEY as string
export const publicSiteDomain = "lokus.website"

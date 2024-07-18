export const siteId = process.env.NEXT_PUBLIC_SITE_ID as string
export const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT as string
export const isDemoSite = process.env.IS_DEMO_SITE
export const revalidationSecretKey = process.env.REVALIDATION_SECRET_KEY as string
export const getTemplateDeepLink = process.env.GET_TEMPLATE_DEEP_LINK as string

export const TEMPLATE_NAME = process.env.NEXT_PUBLIC_TEMPLATE_NAME ?? "Wordsmith"

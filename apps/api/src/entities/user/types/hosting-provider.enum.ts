import { registerEnumType } from "type-graphql"

export enum HostingProvider {
    NETLIFY = "netlify",
    VERCEL = "vercel",
    podium = "podium"
}

registerEnumType(HostingProvider, { name: "HostingProvider" })

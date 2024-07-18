import { registerEnumType } from "type-graphql"

export enum GitProvider {
    Github = "github",
    Bitbucket = "bitbucket"
}

registerEnumType(GitProvider, { name: "GitProvider" })

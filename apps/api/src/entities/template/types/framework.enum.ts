import { registerEnumType } from "type-graphql"

export enum FrameworkEnum {
    NEXTJS = "nextjs",
    GATSBYJS = "gatsbyjs"
}

registerEnumType(FrameworkEnum, { name: "FrameworkEnum" })

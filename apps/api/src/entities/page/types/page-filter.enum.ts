import { registerEnumType } from "type-graphql"

export enum PageFilterEnum {
    ANY = "any",
    PUBLIC = "public",
    PRIVATE = "private"
}

registerEnumType(PageFilterEnum, { name: "PageFilterEnum" })

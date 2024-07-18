import { registerEnumType } from "type-graphql"

/**
 * An enum of possible roles
 * TODO: this is still to implement in auth-handler and request-context (+ jwt.ts)
 *
 * @ignore
 */
export enum AuthRole {
    USER = "user",
    EDITOR = "editor",
    ADMIN = "admin"
}

registerEnumType(AuthRole, {
    name: "AuthRole"
})

import { AuthRole } from "./roles"

export type AuthRequestContext = {
    token?: string
    isAuthenticated: boolean
    isExpired?: boolean
    isApiKey?: boolean
    write?: boolean
    user?: {
        email: string
        id: string
        role: AuthRole
    }
}

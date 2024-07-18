import jsonwebtoken from "jsonwebtoken"

import { AuthRole } from "./roles"
import { jwtSecret as JWT_SECRET } from "config"

/**
 * This is the schema of the data that gets stored in the jwt
 * Here we could add for example a `role` field of type `Role` (an enum which is still to create)
 */
export type TokenData = {
    email: string
    role: AuthRole
    id: string
    write?: boolean
}

/**
 * Checks for token validity
 *
 * @param token a jwt
 * @returns boolean is either `true` or `false`, depending on validity of provided `token`
 */
export const isValid = (token: string): boolean => {
    try {
        jsonwebtoken.verify(token, JWT_SECRET as string)
        return true
    } catch {
        return false
    }
}

/**
 * Decrypts a token into an object of type `TokenData`
 *
 * @param token a jwt
 * @returns `TokenData` is the object that is stored in the jwt payload
 */
export const decrypt = (token: string): TokenData => {
    return jsonwebtoken.verify(token, JWT_SECRET as string) as TokenData
}

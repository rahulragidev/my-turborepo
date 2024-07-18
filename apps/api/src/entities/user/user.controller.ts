import { AuthRequestContext } from "auth/request-context"
import { GraphQLError } from "graphql"
import { UpdateUserInput } from "./types/update-user.input"
import { User, UserModel } from "./user.type"
import { UserInput } from "./types/user.input"
import { UserResponse } from "./types/user.response"

export const checkUser = async (
    email: string,
    context: AuthRequestContext
): Promise<string | null> => {
    try {
        console.log(
            "Check user called with ctx",
            JSON.stringify(context, null, 2)
        )
        if (!context.isApiKey)
            throw new GraphQLError("Where did you come from?")
        const user = await UserModel.findOne({ email: email })
        const id = user?.id
        if (!id) throw new GraphQLError("User not found")
        return id
    } catch (error) {
        console.log("checkUser error:", JSON.stringify(error, null, 2))
        return null
    }
}

export const createUser = async (
    data: UserInput,
    context: AuthRequestContext
): Promise<UserResponse> => {
    try {
        if (!context.isApiKey) throw new GraphQLError("Who're you?")
        const response = await UserModel.create({
            ...data,
            name:
                process.env.NODE_ENV !== "production"
                    ? `${process.env.NODE_ENV}-${data.name}`
                    : data.name
        })
        return {
            success: true,
            message: "User created successfully",
            data: response
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}

// Update User
export const updateUser = async (
    data: UpdateUserInput,
    context: AuthRequestContext
): Promise<UserResponse> => {
    try {
        const response = (await UserModel.findByIdAndUpdate(
            context.user?.id,
            data,
            { new: true }
        )) as User
        return {
            success: true,
            message: "User updated successfully",
            data: response
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Internal Server Error"
        }
    }
}

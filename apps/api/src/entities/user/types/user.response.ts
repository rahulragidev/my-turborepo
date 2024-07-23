import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { User } from "../user.type"

@ObjectType({ description: "User Response" })
export class UserResponse extends ResponseSchema {
    @Field(_type => User, { nullable: true })
    data?: User
}

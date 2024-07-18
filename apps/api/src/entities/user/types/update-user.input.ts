import { Field, InputType, Int } from "type-graphql"
import { User } from "../user.type"

@InputType()
export class UpdateUserInput implements Partial<User> {
    @Field({ nullable: true })
    name?: string

    @Field(_type => Int, { defaultValue: -1, nullable: true })
    onboardingState?: number
}

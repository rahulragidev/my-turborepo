import { Field, InputType, Int } from "type-graphql"
import { User } from "../user.type"

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    email: string

    @Field()
    name: string

    @Field(_type => String)
    trialExpires: Date

    @Field(_type => Int, { defaultValue: -1 })
    onboardingState: number
}

import { Field, ID, InputType } from "type-graphql"

@InputType()
export class UpdatePagesPriority {
    @Field(_type => ID)
    id: number

    @Field(_type => Number)
    priority: number
}

@InputType()
export class UpdatePagesPriorityInput {
    @Field(_type => [UpdatePagesPriority])
    pagesList: UpdatePagesPriority[]
}

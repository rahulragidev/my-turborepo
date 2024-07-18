import { Field, InputType } from "type-graphql"
import { GraphQLJSONObject } from "graphql-type-json"

@InputType({ description: "Mark" })
export class TiptapMarkInput {
    @Field()
    type: string

    @Field(() => [String], { nullable: true })
    attrs?: Record<string, any>
}

@InputType({ description: "Tiptap Content" })
export class TiptapContentInput {
    @Field()
    type: string

    @Field(() => [TiptapContentInput], { nullable: true })
    content?: TiptapContentInput[]

    @Field({ nullable: true })
    text?: string

    @Field(() => [TiptapMarkInput], { nullable: true })
    marks?: TiptapMarkInput[]

    @Field(() => GraphQLJSONObject, { nullable: true })
    attrs?: Record<string, any>
}

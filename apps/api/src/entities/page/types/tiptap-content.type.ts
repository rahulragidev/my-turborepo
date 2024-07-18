import { Field, ObjectType } from "type-graphql"
import { GraphQLJSONObject } from "graphql-type-json"

@ObjectType({ description: "Mark" })
export class TiptapMark {
    @Field()
    type: string

    @Field(() => [String], { nullable: true })
    attrs?: Record<string, any>
}

@ObjectType({ description: "Tiptap Content" })
export class TiptapContent {
    @Field()
    type: string

    @Field(() => [TiptapContent], { nullable: true })
    content?: TiptapContent[]

    @Field({ nullable: true })
    text?: string

    @Field(() => [TiptapMark], { nullable: true })
    marks?: TiptapMark[]

    @Field(() => GraphQLJSONObject, { nullable: true })
    attrs?: Record<string, any>
}

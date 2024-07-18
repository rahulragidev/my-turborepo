/**
 * ResponseSchema
 * --------------
 * Common response shape for all graphql responses
 */

import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
export class ResponseSchema {
    @Field({ defaultValue: true })
    success: boolean

    @Field({ nullable: true })
    message?: string

    @Field(_type => Int, { nullable: true, defaultValue: 200 })
    statusCode?: number | string

    data?: unknown
}

import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"

@ObjectType()
class Response {
    /** The domain price in USD. */
    @Field({ nullable: true, description: "The domain price in USD" })
    price: number
    /** The number of years the domain could be held before paying again. */
    @Field({
        nullable: true,
        description:
            "The number of years the domain could be held before paying again"
    })
    period: number
}

@ObjectType()
export class DomainPriceResponse extends ResponseSchema {
    @Field()
    declare data?: Response
}

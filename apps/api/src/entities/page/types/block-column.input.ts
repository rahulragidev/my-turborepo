/* -------------------------------------------------------------------------- */
/*                                // DEPRECATED                               */
/* -------------------------------------------------------------------------- */

import { Field, InputType } from "type-graphql"

@InputType()
export class BlockColumnInput {
    @Field({ defaultValue: "simple-col" })
    type: string

    @Field({ nullable: true })
    class: string

    @Field({ nullable: true })
    body: string

    @Field({ nullable: true })
    placeholder?: string
}

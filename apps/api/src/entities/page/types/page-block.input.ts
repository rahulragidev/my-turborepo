/* -------------------------------------------------------------------------- */
/*                                // DEPRECATED                               */
/* -------------------------------------------------------------------------- */

import { BlockColumnInput } from "./block-column.input"
import { Field, InputType } from "type-graphql"

@InputType()
export class PageBlockInput {
    @Field({ defaultValue: "simple" })
    type: string

    @Field({ defaultValue: "flex items-center", nullable: true })
    class?: string

    @Field(_type => [BlockColumnInput], { nullable: true })
    columns: BlockColumnInput[]
}

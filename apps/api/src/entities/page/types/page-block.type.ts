/* -------------------------------------------------------------------------- */
/*                                // DEPRECATED                               */
/* -------------------------------------------------------------------------- */

import { BlockColumn } from "./block-column.type"
import { Field, ObjectType } from "type-graphql"
import { Prop } from "@typegoose/typegoose"

@ObjectType()
export class PageBlock {
    @Field({ defaultValue: "simple" })
    @Prop({ default: "simple", required: true })
    type: string

    // @Field()
    // @Prop({ required: true })
    // uid: string

    @Field({ nullable: true })
    @Prop({ default: "flex items-center", required: true })
    class?: string

    @Field(_type => [BlockColumn])
    @Prop({ required: true })
    columns: BlockColumn[]
}

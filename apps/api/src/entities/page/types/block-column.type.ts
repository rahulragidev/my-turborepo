/* -------------------------------------------------------------------------- */
/*                                // DEPRECATED                               */
/* -------------------------------------------------------------------------- */

import { Field, ObjectType } from "type-graphql"
import { Prop } from "@typegoose/typegoose"

@ObjectType()
export class BlockColumn {
    @Field({ defaultValue: "simple-col" })
    @Prop({ default: "simple-col" })
    type: string

    // @Field()
    // @Prop({ required: true })
    // uid: string

    @Field()
    @Prop({ default: "", required: true })
    class: string

    @Field()
    @Prop({ required: true })
    body: string

    @Field({ nullable: true })
    @Prop()
    placeholder?: string
}

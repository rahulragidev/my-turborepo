import { Field, ObjectType } from "type-graphql"
import { GitProvider } from "./git-provider.enum"
import { Prop } from "@typegoose/typegoose"

@ObjectType({ description: "Git Repository / Source" })
export class GitRepository {
    @Field(_type => GitProvider, { defaultValue: GitProvider.Github })
    @Prop({ enum: GitProvider, default: GitProvider.Github })
    type: string

    @Field({ nullable: true })
    @Prop()
    url?: string

    @Field({ defaultValue: "main" })
    @Prop({ defaultValue: "main" })
    ref: string

    @Field()
    @Prop()
    repoId: number

    @Field({ defaultValue: "production" })
    @Prop({ defaultValue: "production" })
    target: string
}

import { Field, InputType } from "type-graphql"
import { GitProvider } from "./git-provider.enum"

@InputType({ description: "Git Repository Input" })
export class GitRepositoryInput {
    @Field(_type => GitProvider, { defaultValue: GitProvider.Github })
    type: string

    @Field({ nullable: true })
    url: string

    @Field({ nullable: true, defaultValue: "main" })
    ref: string

    @Field()
    repoId: string

    @Field({ nullable: true, defaultValue: "production" })
    target: string
}

import { Field, InputType } from "type-graphql"
import { FrameworkEnum } from "./framework.enum"
import { GitRepositoryInput } from "./git-repository.input"

@InputType({ description: "Template Input" })
export class TemplateInput {
    @Field()
    name: string

    @Field({ nullable: true })
    demoLink?: string

    @Field({ nullable: true })
    bannerImage?: string

    @Field(_type => GitRepositoryInput)
    gitSource: GitRepositoryInput

    @Field({ nullable: true })
    description?: string

    @Field({ nullable: true })
    creator?: string

    @Field({ nullable: true, defaultValue: FrameworkEnum.NEXTJS })
    framework?: FrameworkEnum

    @Field({ nullable: true })
    stripeProduct?: string
}

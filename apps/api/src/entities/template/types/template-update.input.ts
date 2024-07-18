import { Field, InputType } from "type-graphql"
import { FrameworkEnum } from "./framework.enum"
import { Template } from "../template.type"
// import { GitRepositoryInput } from "./git-repository.input"
import { GitRepository } from "./git-repository.type"
import { GitRepositoryInput } from "./git-repository.input"

@InputType({ description: "Template Update Input" })
export class TemplateUpdateInput implements Partial<Template> {
    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    bannerImage?: string

    @Field(_type => GitRepositoryInput, { nullable: true })
    gitSource?: GitRepository

    @Field({ nullable: true })
    description?: string

    @Field({ nullable: true })
    stripeProduct?: string

    // @Field({ nullable: true })
    // creator?: string
    @Field({ nullable: true })
    framework?: FrameworkEnum

    @Field({ nullable: true })
    demoLink?: string
}

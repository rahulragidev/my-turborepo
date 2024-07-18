import { Field, ObjectType } from "type-graphql"
import { HostingProvider } from "./hosting-provider.enum"

@ObjectType()
export class Hosting {
    @Field({ nullable: true })
    privateKey?: string

    @Field({ nullable: true })
    publicKey?: string

    @Field(_type => HostingProvider, { nullable: true })
    provider: HostingProvider
}

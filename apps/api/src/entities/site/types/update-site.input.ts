import { Asset } from "../../asset/asset.type"
import { Field, ID, InputType } from "type-graphql"
import { Site } from "../site.type"
import type { Ref } from "@typegoose/typegoose"
// import { VercelProjectDomain } from "./vercel-domain.response"

@InputType()
export class UpdateSiteInput implements Partial<Site> {
    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    textLogo?: string

    @Field(_type => ID, { nullable: true })
    mobileLogo?: Ref<Asset>

    @Field(_type => ID, { nullable: true })
    desktopLogo?: Ref<Asset>
}

import { Field, ObjectType } from "type-graphql"
import { SiteResponse } from "./site.response"
import { SiteStatusResponse } from "./site-status.response"

@ObjectType({ description: "Change Site Template Response" })
export class ChangeSiteTemplateResponse extends SiteResponse {
    @Field(_type => SiteStatusResponse, { nullable: true })
    siteStatus: SiteStatusResponse
}

import { Field, ObjectType } from "type-graphql"
import { Site } from "../site.type"

@ObjectType({ description: "Create Sites Response" })
export class CreateSiteResponse {
    @Field()
    siteCreated: boolean

    @Field()
    vercelProjectCreated: boolean

    @Field()
    pageCreated: boolean

    @Field()
    siteUpdatedWithVercelProjectId: boolean

    @Field()
    frameWorkSet: boolean

    @Field()
    envsAdded: boolean

    @Field()
    subdomainAdded: boolean

    @Field({ nullable: true })
    message: string

    @Field(_type => Site, { nullable: true })
    data?: Site | null
}


// const status = {
//     siteCreated: false,
//     vercelProjectCreated: false,
//     pageCreated: false,
//     frameWorkSet: false,
//     envsAdded: false,
//     subdomainAdded: false,
//     message: "",
//     data: null,
//     updatedSite: null
// }
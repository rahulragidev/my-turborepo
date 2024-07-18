import { Field, InputType } from "type-graphql"
import { Site } from "../site.type"

@InputType()
export class SiteInput implements Partial<Site> {
    @Field()
    slug: string

    @Field({
        defaultValue: "635e2719eb8e4174ebc9998a" // Template-zero
    })
    templateId: string
}

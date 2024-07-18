import { Field, ObjectType } from "type-graphql"
import { ResponseSchema } from "types/response-schema.type"
import { Site } from "../site.type"

@ObjectType({ description: "Site name" })
class SiteInfoData implements Partial<Site> {
    @Field()
    name: string
}

@ObjectType({ description: "Site Response" })
export class SiteInfo extends ResponseSchema {
    @Field(_type => SiteInfoData, { nullable: true })
    declare data?: SiteInfoData
}

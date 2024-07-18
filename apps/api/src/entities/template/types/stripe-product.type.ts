// StripeProduct
// {
//   "id": "prod_NZrj93yQcgMVK1",
//   "object": "product",
//   "active": false,
//   "created": 1679554296,
//   "default_price": "price_1MohzoQsWalm3c0Vkevo1ZNc",
//   "description": null,
//   "images": [],
//   "livemode": false,
//   "metadata": {},
//   "name": "ChatJuneYearly",
//   "package_dimensions": null,
//   "shippable": null,
//   "statement_descriptor": null,
//   "tax_code": "txcd_10103000",
//   "unit_label": null,
//   "updated": 1679557577,
//   "url": null
// }
import GraphQLJSON from "graphql-type-json"
import Stripe from "stripe"
import { Field, ObjectType } from "type-graphql"
import { StripePrice } from "./stripe-price.type"

@ObjectType()
export class StripeProduct {
    @Field()
    id: string

    @Field()
    active: boolean

    @Field(_type => String, { nullable: true })
    description: string | null

    @Field(_type => StripePrice, { nullable: true })
    default_price?: string | Stripe.Price | null

    @Field(_type => [String], { nullable: true })
    images: string[] | null

    @Field({ description: "Whether the product is in live mode / test mode" })
    livemode: boolean

    @Field(_type => GraphQLJSON, { nullable: true })
    metadata: Record<any, any>

    @Field()
    name: string

    @Field(_type => String, { nullable: true })
    package_dimensions: Stripe.Product.PackageDimensions | null

    @Field(_type => Boolean, { nullable: true })
    shippable: boolean | null

    @Field(_type => String, { nullable: true })
    statement_descriptor?: string | null

    @Field(_type => String, { nullable: true })
    tax_code?: Stripe.TaxCode | string | null

    @Field(_type => String, { nullable: true })
    unit_label?: string | null

    @Field()
    updated: number

    @Field(_type => String, { nullable: true })
    url: string | null

    @Field(_type => [StripePrice], { nullable: true })
    prices?: StripePrice[] | null
}

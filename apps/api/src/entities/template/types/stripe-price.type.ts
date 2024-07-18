import Stripe from "stripe"
import { Field, Int, ObjectType } from "type-graphql"
import { GraphQLJSON } from "graphql-type-json"

@ObjectType()
export class StripePrice {
    @Field()
    id: string

    @Field(_type => String)
    object: "price"

    @Field()
    active: boolean

    @Field(_type => String, {
        description:
            "Describes how to compute the price per period. Either per_unit or tiered. per_unit indicates that the fixed amount (specified in unit_amount or unit_amount_decimal) will be charged per unit in quantity (for prices with usage_type=licensed), or per unit of total usage (for prices with usage_type=metered). tiered indicates that the unit pricing will be computed using a tiering strategy as defined using the tiers and tiers_mode attributes."
    })
    billing_scheme: Stripe.Price.BillingScheme

    @Field()
    created: number

    @Field(_type => String)
    currency: string

    @Field(_type => String, { nullable: true })
    custom_unit_amount: Stripe.Price.CustomUnitAmount | null

    @Field({
        description:
            "is true if the object exists in live, false if it's in test mode"
    })
    livemode: boolean

    @Field(_type => String, { nullable: true })
    lookup_key: string | null

    @Field(_type => GraphQLJSON, { nullable: true })
    metadata: Record<any, any>

    @Field(_type => String, { nullable: true })
    nickname?: string | null

    @Field(_type => String, {
        description: "The Product Id that this Price is linked to"
    })
    product: string | Stripe.Product | Stripe.DeletedProduct

    @Field(_type => Recurring, { nullable: true })
    recurring: Recurring | null

    @Field(_type => String, { nullable: true })
    tax_behavior: string | null

    @Field(_type => String, { nullable: true })
    tiers_mode: any

    @Field(_type => String, { nullable: true })
    transform_quantity: any

    @Field()
    type: string

    @Field(_type => Int, {
        description: "The actual price number",
        nullable: true
    })
    unit_amount: number | null

    @Field(_type => String, { nullable: true })
    unit_amount_decimal: string | null
}

@ObjectType()
export class Recurring {
    // aggregate_usage: Record<any, any>
    @Field(_type => String, { nullable: true })
    interval: string

    @Field({ nullable: true })
    interval_count: number

    @Field({ nullable: true })
    usage_type: string
}

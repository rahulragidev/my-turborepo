import Stripe from "stripe"
import { Field, Int, ObjectType } from "type-graphql"
import { GraphQLJSONObject } from "graphql-type-json"
import { StripePrice } from "entities/template/types/stripe-price.type"

@ObjectType()
class StripeSubscription implements Partial<Stripe.Subscription> {
    @Field(_type => String, { nullable: true })
    id?: string | undefined

    @Field(_type => Boolean, { nullable: true })
    livemode?: boolean | undefined

    @Field(_type => String, { nullable: true })
    created?: number | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    discount?: Stripe.Discount | null | undefined

    @Field(_type => String, { nullable: true })
    status?: Stripe.Subscription.Status | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    application: string | Stripe.Application | Stripe.DeletedApplication | null

    @Field(_type => String, { nullable: true })
    cancel_at?: number | null | undefined

    @Field(_type => String, { nullable: true })
    application_fee_percent?: number | null | undefined

    @Field(_type => String, { nullable: true })
    billing_cycle_anchor?: number | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    billing_thresholds?:
        | Stripe.Subscription.BillingThresholds
        | null
        | undefined

    @Field(_type => String, { nullable: true })
    automatic_tax?: Stripe.Subscription.AutomaticTax | undefined

    @Field(_type => String, { nullable: true })
    cancel_at_period_end?: boolean | undefined

    @Field(_type => String, { nullable: true })
    canceled_at?: number | null | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    cancellation_details?:
        | Stripe.Subscription.CancellationDetails
        | null
        | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    collection_method?: Stripe.Subscription.CollectionMethod | undefined

    @Field(_type => String, { nullable: true })
    current_period_end?: number | undefined

    @Field(_type => String, { nullable: true })
    current_period_start?: number | undefined

    @Field(_type => String, { nullable: true })
    currency?: string | undefined

    @Field(_type => String, { nullable: true })
    customer?: string | Stripe.Customer | Stripe.DeletedCustomer | undefined

    @Field(_type => Int, { nullable: true })
    days_until_due?: number | null | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    default_payment_method?: string | Stripe.PaymentMethod | null | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    default_source?: string | Stripe.CustomerSource | null | undefined

    @Field(_type => [GraphQLJSONObject], { nullable: true })
    default_tax_rates?: Stripe.TaxRate[] | null | undefined

    @Field(_type => String, { nullable: true })
    description?: string | null | undefined

    @Field(_type => String, { nullable: true })
    ended_at?: number | null | undefined

    // @Field(_type => String, { nullable: true })
    // items?: Stripe.ApiList<Stripe.SubscriptionItem> | undefined;

    latest_invoice?: string | Stripe.Invoice | null | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    metadata?: Stripe.Metadata | undefined

    @Field(_type => String, { nullable: true })
    next_pending_invoice_item_invoice?: number | null | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    pause_collection?: Stripe.Subscription.PauseCollection | null | undefined

    @Field(_type => String, { nullable: true })
    object?: "subscription" | undefined

    @Field(_type => GraphQLJSONObject, { nullable: true })
    on_behalf_of?: string | Stripe.Account | null | undefined

    @Field(_type => String, { nullable: true })
    payment_settings?: Stripe.Subscription.PaymentSettings | null | undefined

    @Field(_type => String, { nullable: true })
    pending_invoice_item_interval?:
        | Stripe.Subscription.PendingInvoiceItemInterval
        | null
        | undefined

    @Field(_type => String, { nullable: true })
    pending_setup_intent?: string | Stripe.SetupIntent | null | undefined

    @Field(_type => String, { nullable: true })
    pending_update?: Stripe.Subscription.PendingUpdate | null | undefined

    @Field(_type => String, { nullable: true })
    schedule?: string | Stripe.SubscriptionSchedule | null | undefined

    @Field(_type => String, { nullable: true })
    start_date?: number | undefined

    @Field(_type => String, { nullable: true })
    test_clock?: string | Stripe.TestHelpers.TestClock | null | undefined

    @Field(_type => String, { nullable: true })
    transfer_data?: Stripe.Subscription.TransferData | null | undefined

    @Field(_type => String, { nullable: true })
    trial_end?: number | null | undefined

    @Field(_type => String, { nullable: true })
    trial_start?: number | null | undefined

    @Field(_type => StripePrice, { nullable: true })
    currentPlan?: Stripe.Price | undefined
}

export default StripeSubscription

/* eslint-disable camelcase */
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { MoonLoader } from "react-spinners"
import Stripe from "stripe"
import useSWR from "swr"

const Result = () => {
	const router = useRouter()
	const { session_id } = router.query
	console.log(session_id)

	const { data: checkoutData, error } = useSWR<Stripe.Checkout.Session>(
		`/api/checkout/${session_id}`,
		url => fetch(url).then(res => res.json()),
		{
			onSuccess(data) {
				console.log("onSuccess checkout data", data)
				let subscription = data.subscription as Stripe.Subscription
				const latestInvoice = subscription.latest_invoice as Stripe.Invoice

				if (data.status === "complete") console.log("✅ Checkout complete")
				if (latestInvoice?.status === "paid") console.log("✅ Invoice paid")
				if (data.subscription)
					subscription = data.subscription as Stripe.Subscription

				// If Checkout is complete and Invoice is paid, redirect to Deploy page
				if (data.status === "complete" && latestInvoice?.status === "paid") {
					toast.success("Yay! you're now subscribed!", {
						position: "top-center",
					})
					router.push(`/sites`)
				}
			},
		}
	)

	if (checkoutData) {
		// End of Debug stuff
		return (
			<div className="w-screen h-auto py-24 min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center">
					<MoonLoader color="white" />
					<h1 className="text-4xl font-bold">
						Confirming Your Subscription...
					</h1>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<div>
					<h1 className="text-4xl font-bold">Result</h1>
					<pre>
						{error
							? JSON.stringify(checkoutData, null, 2)
							: "Something went wrong!"}
					</pre>
				</div>
			</div>
		)
	}

	return (
		<div className="w-screen h-auto py-24 min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center">
				<MoonLoader color="white" />
				<h1 className="text-4xl font-bold">Loading...</h1>
			</div>
		</div>
	)
}

export default Result

/**
 * 
 * {
        "id": "cs_test_a1aL5MwxiFJDEkG9jzz5CnDTcgODrVC1eEYqKgxDitZSkTDaERUe9gSOBb",
        "object": "checkout.session",
        "after_expiration": null,
        "allow_promotion_codes": null,
        "amount_subtotal": 2000,
        "amount_total": 2000,
        "automatic_tax": {
            "enabled": false,
            "status": null
        },
        "billing_address_collection": null,
        "cancel_url": "http://localhost:3000/checkout/cancel",
        "client_reference_id": null,
        "consent": null,
        "consent_collection": null,
        "created": 1677935331,
        "currency": "usd",
        "custom_fields": [],
        "custom_text": {
            "shipping_address": null,
            "submit": null
        },
        "customer": "cus_NSqXd7sEPJQQC1",
        "customer_creation": "always",
        "customer_details": {
            "address": {
            "city": null,
            "country": "IN",
            "line1": null,
            "line2": null,
            "postal_code": null,
            "state": null
            },
            "email": "praneeth@clearcut.design",
            "name": "Alan watts",
            "phone": null,
            "tax_exempt": "none",
            "tax_ids": []
        },
        "customer_email": null,
        "expires_at": 1678021730,
        "invoice": "in_1MhuqVQsWalm3c0VDvZxlXvB",
        "invoice_creation": null,
        "livemode": false,
        "locale": null,
        "metadata": {},
        "mode": "subscription",
        "payment_intent": null,
        "payment_link": null,
        "payment_method_collection": "always",
        "payment_method_options": null,
        "payment_method_types": [
            "card"
        ],
        "payment_status": "paid",
        "phone_number_collection": {
            "enabled": false
        },
        "recovered_from": null,
        "setup_intent": null,
        "shipping_address_collection": null,
        "shipping_cost": null,
        "shipping_details": null,
        "shipping_options": [],
        "status": "complete",
        "submit_type": null,
        "subscription": {
            "id": "sub_1MhuqVQsWalm3c0Vj4eABV98",
            "object": "subscription",
            "application": null,
            "application_fee_percent": null,
            "automatic_tax": {
                "enabled": false
            },
            "billing_cycle_anchor": 1677935395,
            "billing_thresholds": null,
            "cancel_at": null,
            "cancel_at_period_end": false,
            "canceled_at": null,
            "cancellation_details": {
                "comment": null,
                "feedback": null,
                "reason": null
            },
            "collection_method": "charge_automatically",
            "created": 1677935395,
            "currency": "usd",
            "current_period_end": 1680613795,
            "current_period_start": 1677935395,
            "customer": "cus_NSqXd7sEPJQQC1",
            "days_until_due": null,
            "default_payment_method": "pm_1MhuqUQsWalm3c0VZGHZAlMU",
            "default_source": null,
            "default_tax_rates": [],
            "description": null,
            "discount": null,
            "ended_at": null,
            "items": {
            "object": "list",
            "data": [
                {
                "id": "si_NSqXdBGtjO0xEo",
                "object": "subscription_item",
                "billing_thresholds": null,
                "created": 1677935396,
                "metadata": {},
                "plan": {
                    "id": "price_1MhuoWQsWalm3c0VXxKZ3y6n",
                    "object": "plan",
                    "active": true,
                    "aggregate_usage": null,
                    "amount": 2000,
                    "amount_decimal": "2000",
                    "billing_scheme": "per_unit",
                    "created": 1677935272,
                    "currency": "usd",
                    "interval": "month",
                    "interval_count": 1,
                    "livemode": false,
                    "metadata": {},
                    "nickname": null,
                    "product": "prod_NSqVEk764c1c7z",
                    "tiers_mode": null,
                    "transform_usage": null,
                    "trial_period_days": null,
                    "usage_type": "licensed"
                },
                "price": {
                    "id": "price_1MhuoWQsWalm3c0VXxKZ3y6n",
                    "object": "price",
                    "active": true,
                    "billing_scheme": "per_unit",
                    "created": 1677935272,
                    "currency": "usd",
                    "custom_unit_amount": null,
                    "livemode": false,
                    "lookup_key": null,
                    "metadata": {},
                    "nickname": null,
                    "product": "prod_NSqVEk764c1c7z",
                    "recurring": {
                    "aggregate_usage": null,
                    "interval": "month",
                    "interval_count": 1,
                    "trial_period_days": null,
                    "usage_type": "licensed"
                    },
                    "tax_behavior": "exclusive",
                    "tiers_mode": null,
                    "transform_quantity": null,
                    "type": "recurring",
                    "unit_amount": 2000,
                    "unit_amount_decimal": "2000"
                },
                "quantity": 1,
                "subscription": "sub_1MhuqVQsWalm3c0Vj4eABV98",
                "tax_rates": []
                }
            ],
            "has_more": false,
            "total_count": 1,
            "url": "/v1/subscription_items?subscription=sub_1MhuqVQsWalm3c0Vj4eABV98"
            },
            "latest_invoice": {
                "id": "in_1MhuqVQsWalm3c0VDvZxlXvB",
                "object": "invoice",
                "account_country": "US",
                "account_name": "Lokus LLC",
                "account_tax_ids": null,
                "amount_due": 2000,
                "amount_paid": 2000,
                "amount_remaining": 0,
                "amount_shipping": 0,
                "application": null,
                "application_fee_amount": null,
                "attempt_count": 1,
                "attempted": true,
                "auto_advance": false,
                "automatic_tax": {
                    "enabled": false,
                    "status": null
                },
            "billing_reason": "subscription_create",
            "charge": "ch_3MhuqVQsWalm3c0V0wSeXZ9P",
            "collection_method": "charge_automatically",
            "created": 1677935395,
            "currency": "usd",
            "custom_fields": null,
            "customer": "cus_NSqXd7sEPJQQC1",
            "customer_address": {
                "city": null,
                "country": "IN",
                "line1": null,
                "line2": null,
                "postal_code": null,
                "state": null
            },
            "customer_email": "praneeth@clearcut.design",
            "customer_name": "Alan watts",
            "customer_phone": null,
            "customer_shipping": null,
            "customer_tax_exempt": "none",
            "customer_tax_ids": [],
            "default_payment_method": null,
            "default_source": null,
            "default_tax_rates": [],
            "description": null,
            "discount": null,
            "discounts": [],
            "due_date": null,
            "ending_balance": 0,
            "footer": null,
            "from_invoice": null,
            "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1Lf0GqQsWalm3c0V/test_YWNjdF8xTGYwR3FRc1dhbG0zYzBWLF9OU3FYUzhGUVhDQ2hCRXZYWWM0eVh1SGYwbWk2ZGlCLDY4NTAxNDY40200qga81hVK?s=ap",
            "invoice_pdf": "https://pay.stripe.com/invoice/acct_1Lf0GqQsWalm3c0V/test_YWNjdF8xTGYwR3FRc1dhbG0zYzBWLF9OU3FYUzhGUVhDQ2hCRXZYWWM0eVh1SGYwbWk2ZGlCLDY4NTAxNDY40200qga81hVK/pdf?s=ap",
            "last_finalization_error": null,
            "latest_revision": null,
            "lines": {
                "object": "list",
                "data": [
                {
                    "id": "il_1MhuqVQsWalm3c0VjMTdA9Bh",
                    "object": "line_item",
                    "amount": 2000,
                    "amount_excluding_tax": 2000,
                    "currency": "usd",
                    "description": "1 × Lokus Basic Monthly 2 (at $20.00 / month)",
                    "discount_amounts": [],
                    "discountable": true,
                    "discounts": [],
                    "livemode": false,
                    "metadata": {},
                    "period": {
                    "end": 1680613795,
                    "start": 1677935395
                    },
                    "plan": {
                    "id": "price_1MhuoWQsWalm3c0VXxKZ3y6n",
                    "object": "plan",
                    "active": true,
                    "aggregate_usage": null,
                    "amount": 2000,
                    "amount_decimal": "2000",
                    "billing_scheme": "per_unit",
                    "created": 1677935272,
                    "currency": "usd",
                    "interval": "month",
                    "interval_count": 1,
                    "livemode": false,
                    "metadata": {},
                    "nickname": null,
                    "product": "prod_NSqVEk764c1c7z",
                    "tiers_mode": null,
                    "transform_usage": null,
                    "trial_period_days": null,
                    "usage_type": "licensed"
                    },
                    "price": {
                    "id": "price_1MhuoWQsWalm3c0VXxKZ3y6n",
                    "object": "price",
                    "active": true,
                    "billing_scheme": "per_unit",
                    "created": 1677935272,
                    "currency": "usd",
                    "custom_unit_amount": null,
                    "livemode": false,
                    "lookup_key": null,
                    "metadata": {},
                    "nickname": null,
                    "product": "prod_NSqVEk764c1c7z",
                    "recurring": {
                        "aggregate_usage": null,
                        "interval": "month",
                        "interval_count": 1,
                        "trial_period_days": null,
                        "usage_type": "licensed"
                    },
                    "tax_behavior": "exclusive",
                    "tiers_mode": null,
                    "transform_quantity": null,
                    "type": "recurring",
                    "unit_amount": 2000,
                    "unit_amount_decimal": "2000"
                    },
                    "proration": false,
                    "proration_details": {
                    "credited_items": null
                    },
                    "quantity": 1,
                    "subscription": "sub_1MhuqVQsWalm3c0Vj4eABV98",
                    "subscription_item": "si_NSqXdBGtjO0xEo",
                    "tax_amounts": [],
                    "tax_rates": [],
                    "type": "subscription",
                    "unit_amount_excluding_tax": "2000"
                }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/invoices/in_1MhuqVQsWalm3c0VDvZxlXvB/lines"
            },
            "livemode": false,
            "metadata": {},
            "next_payment_attempt": null,
            "number": "5E0FD262-0001",
            "on_behalf_of": null,
            "paid": true,
            "paid_out_of_band": false,
            "payment_intent": {
                "id": "pi_3MhuqVQsWalm3c0V0HaUGPt5",
                "object": "payment_intent",
                "amount": 2000,
                "amount_capturable": 0,
                "amount_details": {
                "tip": {}
                },
                "amount_received": 2000,
                "application": null,
                "application_fee_amount": null,
                "automatic_payment_methods": null,
                "canceled_at": null,
                "cancellation_reason": null,
                "capture_method": "automatic",
                "client_secret": "pi_3MhuqVQsWalm3c0V0HaUGPt5_secret_40Y6cgVlAnJeJOVlENGqhT9az",
                "confirmation_method": "automatic",
                "created": 1677935395,
                "currency": "usd",
                "customer": "cus_NSqXd7sEPJQQC1",
                "description": "Subscription creation",
                "invoice": "in_1MhuqVQsWalm3c0VDvZxlXvB",
                "last_payment_error": null,
                "latest_charge": "ch_3MhuqVQsWalm3c0V0wSeXZ9P",
                "livemode": false,
                "metadata": {},
                "next_action": null,
                "on_behalf_of": null,
                "payment_method": "pm_1MhuqUQsWalm3c0VZGHZAlMU",
                "payment_method_options": {
                "card": {
                    "installments": null,
                    "mandate_options": null,
                    "network": null,
                    "request_three_d_secure": "automatic",
                    "setup_future_usage": "off_session"
                },
                "us_bank_account": {
                    "verification_method": "automatic"
                }
                },
                "payment_method_types": [
                "card",
                "us_bank_account"
                ],
                "processing": null,
                "receipt_email": null,
                "review": null,
                "setup_future_usage": "off_session",
                "shipping": null,
                "source": null,
                "statement_descriptor": null,
                "statement_descriptor_suffix": null,
                "status": "succeeded",
                "transfer_data": null,
                "transfer_group": null
            },
            "payment_settings": {
                "default_mandate": null,
                "payment_method_options": null,
                "payment_method_types": null
            },
            "period_end": 1677935395,
            "period_start": 1677935395,
            "post_payment_credit_notes_amount": 0,
            "pre_payment_credit_notes_amount": 0,
            "quote": null,
            "receipt_number": null,
            "rendering_options": null,
            "shipping_cost": null,
            "shipping_details": null,
            "starting_balance": 0,
            "statement_descriptor": null,
            "status": "paid",
            "status_transitions": {
                "finalized_at": 1677935395,
                "marked_uncollectible_at": null,
                "paid_at": 1677935397,
                "voided_at": null
            },
            "subscription": "sub_1MhuqVQsWalm3c0Vj4eABV98",
            "subtotal": 2000,
            "subtotal_excluding_tax": 2000,
            "tax": null,
            "test_clock": null,
            "total": 2000,
            "total_discount_amounts": [],
            "total_excluding_tax": 2000,
            "total_tax_amounts": [],
            "transfer_data": null,
            "webhooks_delivered_at": 1677935395
            },
            "livemode": false,
            "metadata": {},
            "next_pending_invoice_item_invoice": null,
            "on_behalf_of": null,
            "pause_collection": null,
            "payment_settings": {
            "payment_method_options": null,
            "payment_method_types": null,
            "save_default_payment_method": "off"
            },
            "pending_invoice_item_interval": null,
            "pending_setup_intent": null,
            "pending_update": null,
            "plan": {
            "id": "price_1MhuoWQsWalm3c0VXxKZ3y6n",
            "object": "plan",
            "active": true,
            "aggregate_usage": null,
            "amount": 2000,
            "amount_decimal": "2000",
            "billing_scheme": "per_unit",
            "created": 1677935272,
            "currency": "usd",
            "interval": "month",
            "interval_count": 1,
            "livemode": false,
            "metadata": {},
            "nickname": null,
            "product": "prod_NSqVEk764c1c7z",
            "tiers_mode": null,
            "transform_usage": null,
            "trial_period_days": null,
            "usage_type": "licensed"
            },
            "quantity": 1,
            "schedule": null,
            "start_date": 1677935395,
            "status": "active",
            "test_clock": null,
            "transfer_data": null,
            "trial_end": null,
            "trial_settings": {
            "end_behavior": {
                "missing_payment_method": "create_invoice"
            }
            },
            "trial_start": null
        },
        "success_url": "http://localhost:3000/checkout/result?session_id={CHECKOUT_SESSION_ID}",
        "total_details": {
            "amount_discount": 0,
            "amount_shipping": 0,
            "amount_tax": 0
        },
        "url": null
        }
 * 
 */

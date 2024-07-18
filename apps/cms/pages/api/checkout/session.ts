import { NextApiRequest, NextApiResponse } from "next"

// import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from "../../../config"
// import { formatAmountForStripe } from "../../../utils/stripe-helpers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: "2023-10-16",
	maxNetworkRetries: 2, // Retry a request twice before giving up
	typescript: true,
})
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<Stripe.Checkout.Session | any> {
	if (req.method === "POST") {
		const {
			lineItems,
			email,
			redirectPath,
		}: {
			lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
			email: string
			redirectPath: string
		} = req.body
		try {
			console.log("lineItems", lineItems)
			// console.log("email", email)
			// Create Checkout Sessions from body params.
			const params: Stripe.Checkout.SessionCreateParams = {
				customer_email: email,
				payment_method_types: ["card"],

				// add line items received as body params
				line_items: lineItems,
				mode: "subscription",
				subscription_data: {
					metadata: {
						// eslint-disable-next-line camelcase
						user_email: email,
					},
				},
				allow_promotion_codes: true,
				success_url: `${req.headers.origin}${redirectPath}?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}${redirectPath}?session_id={CHECKOUT_SESSION_ID}}`,
			}
			const checkoutSession: Stripe.Checkout.Session =
				await stripe.checkout.sessions.create(params)

			console.log("checkoutSession", checkoutSession)

			// eslint-disable-next-line camelcase
			res.status(200).json(checkoutSession)
		} catch (err) {
			console.log(err)
			const errorMessage =
				err instanceof Error ? err.message : "Internal server error"
			res.status(500).json({ statusCode: 500, message: errorMessage })
		}
	} else {
		res.setHeader("Allow", "POST")
		res.status(405).end("Method Not Allowed")
	}
}

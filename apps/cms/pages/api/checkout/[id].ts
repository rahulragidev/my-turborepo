import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	// https://github.com/stripe/stripe-node#configuration
	// new apiKey version updated
	apiVersion: "2023-10-16",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const id: string = req.query.id as string
	try {
		if (!id.startsWith("cs_")) {
			throw Error("Incorrect CheckoutSession ID.")
		}
		const checkoutSession: Stripe.Checkout.Session =
			await stripe.checkout.sessions.retrieve(id, {
				expand: ["subscription", "subscription.latest_invoice.payment_intent"],
			})

		res.status(200).json(checkoutSession)
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "Internal server error"
		res.status(500).json({ statusCode: 500, message: errorMessage })
	}
}

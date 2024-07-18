import Stripe from "stripe"
import getStripe from "./getStripe"

const createCheckout = async ({
	lineItems,
	email,
	redirectPath = "/sites",
}: {
	lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
	email: string
	redirectPath: string
}) => {
	// when the customer clicks on the button, redirect them to Checkout.
	const stripe = await getStripe()
	const session = await fetch("/api/checkout/session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			lineItems,
			email,
			redirectPath,
		}),
	}).then(res => res.json())

	console.log("createCheckout response", session)

	if (!stripe) {
		console.log("stripe failed to load")
		return null
	}
	const { error } = await stripe.redirectToCheckout({ sessionId: session.id })

	if (error) {
		console.error(error?.message || error || "something went wrong @createCheckout ")
	}
	return session
}

export default createCheckout

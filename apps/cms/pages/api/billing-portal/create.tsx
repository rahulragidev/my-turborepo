// Create Stripe billing portal using CustomerId and the return URL
import { getAuth } from "@clerk/nextjs/server"
import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: "2023-10-16",
	maxNetworkRetries: 2, // Retry a request twice before giving up
	typescript: true,
})

async function getActiveProductsAndPrices() {
	const allActiveProducts = await stripe.products.list({
		active: true, // Filter for only active products
		limit: 10, // Adjust 'limit' as needed
	})

	const activeProductsWithPrices = await Promise.all(
		allActiveProducts.data.map(async product => {
			const validPrices = await stripe.prices.list({
				product: product.id,
				active: true, // Filter for only active prices
			})
			const filteredPrices = validPrices.data.filter(
				price => price.active && price.billing_scheme === "per_unit"
			)

			return {
				product: product.id,
				prices: filteredPrices.map(price => price.id),
			}
		})
	)

	console.log(
		"activeProductsWithPrices",
		JSON.stringify(activeProductsWithPrices, null, 2)
	)

	return activeProductsWithPrices.filter(product => product.prices.length > 0)
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<Stripe.Response<Stripe.BillingPortal.Session> | any> {
	if (req.method === "POST") {
		try {
			const { customerId } = req.body
			const { userId } = await getAuth(req)

			if (!userId) {
				return res.status(401).json({ error: "Not authenticated" })
			}

			const productsAndPriceList = await getActiveProductsAndPrices()

			console.log(
				"productsAndPriceList",
				JSON.stringify(productsAndPriceList, null, 2)
			)

			const configuration: Stripe.BillingPortal.ConfigurationCreateParams = {
				business_profile: {
					headline: "Lokus, LLC partners with Stripe to handle billing.",
				},
				features: {
					customer_update: {
						enabled: true,
						allowed_updates: ["tax_id", "name"],
					},
					invoice_history: {
						enabled: true,
					},
					payment_method_update: {
						enabled: true,
					},
					subscription_cancel: {
						enabled: true,
						// cancellation_reason: {
						//	enabled: false,
						//	// options: [
						//	//	"customer_service",
						//	//	"low_quality",
						//	//	"missing_features",
						//	//	"other",
						//	//	"too_complex",
						//	//	"too_expensive",
						//	//	"unused",
						//	//	"other",
						//	// ],
						// },
					},
					subscription_pause: {
						enabled: false,
					},
					subscription_update: {
						default_allowed_updates: ["price"],
						enabled: true,
						products: productsAndPriceList,
						proration_behavior: "create_prorations",
					},
				},
			}

			const configurationResponse =
				await stripe.billingPortal.configurations.create(configuration)

			const session = await stripe.billingPortal.sessions.create({
				customer: customerId,
				return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sites`,
				configuration: configurationResponse.id,
			})

			console.log("Billing Portal Session", session)

			return res.status(200).json({ url: session.url })
		} catch (err) {
			console.log(err)
			return res.status(500).json({ message: "Internal Server Error" })
		}
	} else {
		// res.setHeader("Allow", "POST")
		res.status(405).json({ message: "Method Not Allowed" })
		return null
	}
}

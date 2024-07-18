/* eslint-disable camelcase */
// eslint-disable-next-line camelcase
import FAQ from "components/FAQ"
import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"
import { unstable_cache } from "next/cache"
import faqs from "static-data/faqs"
import Stripe from "stripe"
import { IPlan } from "types"
import PricingPlanCard from "./PricingPlanCard"
import PricingToggle from "./PricingToggle"

const fetchPlans = unstable_cache(
	async (): Promise<IPlan[] | null> => {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
			apiVersion: "2023-10-16",
		})

		if (!stripe) {
			console.log("failed to load stripe")
			return null
		}

		const { data: products } = await stripe.products.list({
			active: true,
		})
		const { data: prices } = await stripe.prices.list({ active: true })
		const plansData = products.map(product => {
			const productPrices = prices
				.filter(price => price.product === product.id)
				.map(price => ({
					id: price.id,
					amount: price.unit_amount && price.unit_amount / 100,
					// day, week, month, or year
					interval: price.recurring && price.recurring.interval,
				}))

			return {
				id: product.id,
				name: product.name,
				description: product.description,
				prices: productPrices,
			}
		})

		return plansData.reverse()
	},
	["plans"],
	{
		revalidate: 60 * 60 * 24, // 24 hours
	}
)

const Pricing = async () => {
	const plans = await fetchPlans()
	return (
		<>
			<Header />
			<div className="mx-auto max-w-6xl py-32">
				<div className="space-y-4 mb-16">
					<h1 className="text-6xl font-normal tracking-tight">Pricing</h1>
					<PricingToggle />
				</div>
				{plans && (
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{plans.map(plan => (
							<PricingPlanCard key={plan.id} plan={plan} />
						))}
					</div>
				)}

				{/* FAQs */}
				<h3 className="text-3xl font-medium mt-24 mb-8 capitalize">
					Frequently Asked Questions
				</h3>
				<div className="w-full space-y-4">
					{faqs.map(faq => (
						<FAQ
							key={faq.question}
							faq={{
								question: faq.question,
								answer: faq.answer,
							}}
						/>
					))}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default Pricing

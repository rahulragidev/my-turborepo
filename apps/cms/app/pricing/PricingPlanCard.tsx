"use client"

import { useUser } from "@clerk/nextjs"
import Button from "components/Button"
import useUserData from "dataHooks/useUser"
import createCheckout from "libs/stripe/createCheckout"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import Stripe from "stripe"
import { IPlan } from "types"

const PricingPlanCard = ({ plan }: { plan: IPlan }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const interval = searchParams?.get("interval") || "month"
	const { data: userData } = useUserData()
	const { user, isSignedIn } = useUser()
	const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)

	const handleSubscribe = useCallback(
		async (price: {
			id: any
			amount?: number | null
			interval?: Stripe.Price.Recurring.Interval | null
		}): Promise<void> => {
			console.log("handleSubscribe", price)
			console.log("handleSubscribe")
			if (!isSignedIn) {
				console.log("Not signed in. Taking to sign in page...")
				router.push(`/sign-in?takeToCheckout=true&priceId=${price.id}`)
				return
			}
			setIsLoadingCheckout(true)
			await createCheckout({
				email: user?.emailAddresses[0].emailAddress as string,
				lineItems: [
					{
						price: price.id,
						quantity: 1,
					},
				],
				redirectPath: "/sites",
			}).then(() => setIsLoadingCheckout(false))
		},
		[isSignedIn, user?.emailAddresses, router]
	)

	console.log("currentPlan", userData?.data?.data?.subscription?.currentPlan?.id)
	console.log("subscription status", userData?.data?.data?.subscription?.status)

	const subscriptionStatus = userData?.data?.data?.subscription?.status
	const currentPlanId = userData?.data?.data?.subscription?.currentPlan?.id

	return (
		<div
			key={plan.id}
			className="space-y-12 border-2 border-slate-700 p-8 rounded-xl shadow-md">
			<div>
				<h3 className="text-2xl font-semibold text-slate-50">{plan.name}</h3>
				<p className="text-base">{plan.description}</p>
			</div>
			{plan.prices ? (
				plan.prices
					.filter(price => price.interval === interval)
					.sort((a, b) => b.amount! - a.amount!)
					.map(price => (
						<div key={price.id} className="space-y-4">
							<div>
								<p className="text-4xl font-medium text-slate-50">
									${price.amount}
								</p>
								<p>per {price.interval}</p>
							</div>
							{subscriptionStatus === "active" &&
							currentPlanId === price.id ? (
								<div className="w-full py-2 text-lg flex items-center space-x-2 bg-slate-800 px-2 rounded">
									<CheckCircle />
									<span>Current Plan</span>
								</div>
							) : (
								<Button
									loading={isLoadingCheckout}
									onClick={() => handleSubscribe(price)}>
									Subscribe
								</Button>
							)}
						</div>
					))
			) : (
				<Link
					href="/contact"
					className="px-4 py-1 bg-slate-100 text-slate-800 rounded">
					Contact
				</Link>
			)}
		</div>
	)
}

export default PricingPlanCard

import { useUser } from "@clerk/nextjs"
import getSymbolFromCurrency from "currency-symbol-map"
import useUserData from "dataHooks/useUser"
import createCheckout from "libs/stripe/createCheckout"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { Check, Loader } from "react-feather"
import Stripe from "stripe"
import { StripePrice, StripeSubscription } from "types/generated/types"
import Button from "./Button"
import ToggleButtonGroup from "./ToogleButtonGroup"

interface ICustomPrice {
	id: string
	nickname: string
	unit_amount: number
	currency: string
	recurring: {
		interval: number
	}
}

const CustomPriceObj: ICustomPrice = {
	id: "custom-price",
	nickname: "1M+ page view / month",
	unit_amount: 0,
	currency: "usd",
	recurring: {
		interval: 1000000,
	},
}

const PricingCalculator = ({
	yearlyPrices,
	monthlyPrices,
}: {
	yearlyPrices: Stripe.Price[]
	monthlyPrices: Stripe.Price[]
}) => {
	const { user, isSignedIn } = useUser()
	const { data: userData } = useUserData()
	const router = useRouter()

	const existingSubscription = userData?.data?.data?.subscription as StripeSubscription

	const [recurringInterval, setRecurringInterval] = useState<"month" | "year">(
		existingSubscription?.currentPlan?.recurring?.interval === "month"
			? "month"
			: "year"
	)
	const [selectedPrice, setSelectedPrice] = useState<StripePrice | Stripe.Price | null>(
		userData?.data?.data?.subscription?.currentPlan ?? null
	)

	const [contactingStatus, setContactingStatus] = useState<
		"default" | "contacting" | "contacted" | "failed"
	>("default")

	const renderContactButtonText = useCallback(() => {
		switch (contactingStatus) {
			case "default":
				return <>Contact Us</>
			case "contacting":
				return (
					<span className="flex items-center">
						<Loader className="animate-spin" height={16} /> Contacting
					</span>
				)
			case "contacted":
				return (
					<span className="flex items-center text-green-600">
						<Check height={16} /> Contacted
					</span>
				)
			case "failed":
				return <>Failed! Retry</>
			default:
				return <>Contact Us</>
		}
	}, [contactingStatus])

	// Function to trigger contact us
	const handleContactUs = useCallback(async () => {
		console.log("handleContactUs")
		setContactingStatus("contacting")
		await fetch(
			`/api/email/custom-pricing-request/?email=${user?.primaryEmailAddress
				?.emailAddress!}&firstName=${user?.firstName}`
		).then(res => {
			console.log(res)
			if (res.ok) setContactingStatus("contacted")
			else setContactingStatus("failed")
		})

		// console.log(response)
	}, [user?.firstName, user?.primaryEmailAddress?.emailAddress])

	// Render Subscribe Button
	const renderSubscribeButton = useCallback(() => {
		// Function to trigger createCheckout
		const handleSubscribe = () => {
			console.log("handleSubscribe")
			if (!isSignedIn) {
				console.log("Not signed in. Taking to sign in page...")
				router.push(`/sign-in?takeToCheckout=true&priceId=${selectedPrice?.id}`)
				return
			}
			createCheckout({
				email: user?.primaryEmailAddress?.emailAddress!,
				lineItems: [
					{
						price: selectedPrice?.id!,
						quantity: 1,
					},
				],
				redirectPath: "/sites",
			})
		}

		// If there is no selectedPrice, render nothing
		if (
			// user has selected a price
			selectedPrice &&
			// the selected price is not as same the existingSubscription
			selectedPrice.id !== userData?.data?.data?.subscription?.currentPlan?.id
		) {
			// Show the button
			if (selectedPrice.id === "custom-price")
				// show contact us button
				return (
					<Button
						onClick={() => handleContactUs()}
						disabled={contactingStatus === "contacted"}>
						{renderContactButtonText()}
					</Button>
				)
			return (
				// show upgrade/subscribe button
				<Button onClick={() => handleSubscribe()}>
					{existingSubscription ? "Change to" : "Subscribe for"} $
					{selectedPrice.unit_amount! / 100} /{" "}
					{selectedPrice?.recurring?.interval}
				</Button>
			)
		}
		return null
	}, [
		contactingStatus,
		existingSubscription,
		handleContactUs,
		isSignedIn,
		renderContactButtonText,
		router,
		selectedPrice,
		user?.primaryEmailAddress?.emailAddress,
		userData?.data?.data?.subscription?.currentPlan?.id,
	])

	const handleSelectedPriceChange = (price: Stripe.Price) => {
		setSelectedPrice(price)
	}

	return (
		<div className="w-full rounded-2xl border-2 border-solid border-slate-500/30 p-8 space-y-8">
			<div className="w-full flex items-center justify-end">
				{/* <h2 className="text-3xl">Your monthly page views</h2> */}
				{/* Monthly & annual toggle */}
				<ToggleButtonGroup
					className="w-full"
					buttons={[
						{
							label: "Monthly",
							onClick: () => setRecurringInterval("month"),
							active: recurringInterval === "month",
						},
						{
							label: "Yearly",
							onClick: () => setRecurringInterval("year"),
							active: recurringInterval === "year",
						},
					]}
				/>
			</div>

			<div>
				{recurringInterval === "month" &&
					monthlyPrices
						.sort((a, b) => a.unit_amount! - b.unit_amount!)
						.map(price => (
							<PriceList
								isExistingSubscription={
									existingSubscription?.currentPlan?.id === price.id
								}
								price={price}
								checked={selectedPrice?.id === price.id}
								handleOnChangeOrClick={handleSelectedPriceChange}
							/>
						))}
				{recurringInterval === "year" &&
					yearlyPrices
						.sort((a, b) => a.unit_amount! - b.unit_amount!)
						.map(price => (
							<PriceList
								isExistingSubscription={
									existingSubscription?.currentPlan?.id === price.id
								}
								key={price.id}
								price={price}
								checked={selectedPrice?.id === price.id}
								handleOnChangeOrClick={handleSelectedPriceChange}
							/>
						))}
			</div>

			{/* Pricing */}
			<div className="flex items-end justify-between">
				{renderSubscribeButton()}
			</div>

			<hr className="border-slate-800" />
			<ul className="text-slate-500">
				<li>Unlimited Sites & Pages</li>
				<li>Unlimited Custom Domain</li>
				<li>Free SSL</li>
				<li>Analytics (Coming soon)</li>
				<li>SEO (Coming soon)</li>
			</ul>
		</div>
	)
}

export default PricingCalculator

const PriceList = ({
	price,
	checked,
	handleOnChangeOrClick,
	isExistingSubscription = false,
}: {
	price: Stripe.Price
	checked: boolean
	handleOnChangeOrClick: (_price: Stripe.Price) => void
	isExistingSubscription: boolean
}) => {
	return (
		<fieldset
			key={price.id}
			className="space-x-2 flex items-center justify-between py-2">
			<button
				type="button"
				onClick={() => handleOnChangeOrClick(price)}
				className="flex items-center space-x-2">
				{isExistingSubscription ? (
					<div className="w-6 h-6 rounded-full bg-slate-500/30 flex items-center justify-center">
						<Check height={16} />
					</div>
				) : (
					<input
						name={price.id}
						type="checkbox"
						checked={checked}
						onChange={() => handleOnChangeOrClick(price)}
						className="-mb-1 w-6 h-6 rounded-full"
					/>
				)}
				<label htmlFor={price.id} className="text-slate-400 text-xl">
					{price.nickname}
				</label>
			</button>

			<div className="flex items-center space-x-2">
				{isExistingSubscription && (
					<p className="px-2 py-2 bg-black roudned text-sm">Current plan</p>
				)}
				<h3 className="text-2xl font-medium tracking-tight">
					{getSymbolFromCurrency(price.currency)} {price.unit_amount! / 100} /{" "}
					{price.recurring?.interval}
				</h3>
			</div>
		</fieldset>
	)
}

const _CustomPrice = ({
	checked,
	handleOnChangeOrClick,
}: {
	checked: boolean
	handleOnChangeOrClick: (_price: ICustomPrice) => void
}) => {
	return (
		<fieldset
			key="custom-price-fieldset"
			className="space-x-2 flex items-center justify-between py-2">
			<button
				type="button"
				onClick={() => handleOnChangeOrClick(CustomPriceObj)}
				className="flex items-center space-x-2">
				<input
					name="custom-price"
					type="checkbox"
					checked={checked}
					onChange={() => handleOnChangeOrClick(CustomPriceObj)}
					className="-mb-1 w-6 h-6 rounded-full"
				/>

				<label htmlFor="custom-price" className="text-slate-400 text-xl">
					1M+ page view / month
				</label>
			</button>

			<div className="flex items-center space-x-2">
				{/* {isExistingSubscription && (
					<p className="px-2 py-2 bg-black roudned text-sm">Current plan</p>
				)} */}
				<h3 className="text-2xl font-medium tracking-tight">Contact Us</h3>
			</div>
		</fieldset>
	)
}

import MadeWithLokus from "@/app/components/MadeWithLokus"
import { apiEndpoint, revalidationSecretKey } from "@/config"
import getSideById from "@/libs/getSiteById"
import { gql } from "graphql-request"

const GET_SUBSCRIPTION_STATUS = gql`
	query CheckSubscription($secretKey: String!, $email: String!) {
		data: checkSubscription(secretKey: $secretKey, email: $email)
	}
`

const getIfSubscriptionIsActive = async (email: string): Promise<Boolean> => {
	try {
		const response = await fetch(apiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: GET_SUBSCRIPTION_STATUS,
				variables: {
					email,
					secretKey: revalidationSecretKey,
				},
			}),
			next: {
				revalidate: 2,
			},
		})

		if (!response.ok) throw new Error(response.statusText)
		const subscription = await response.json()
		console.log(
			"getIfSubscriptionIsActive response:",
			JSON.stringify(subscription, null, 2)
		)
		if (
			subscription.data.data === "active" ||
			subscription.data.data === "trialing" ||
			subscription.data.data === "unpaid"
		) {
			return true
		}
		return false
	} catch (error: any) {
		return false
	}
}

const Footer = async () => {
	const site = await getSideById()
	const isSubscriptionActive = await getIfSubscriptionIsActive(
		site?.data?.data?.data?.owner?.email as string
	)
	console.log("isSubscriptionActive", isSubscriptionActive)

	return (
		<>
			<footer className="max-w-6xl mx-auto px-6 py-12 min-h-[10rem]">
				<div className="flex flex-col lg:flex-row items-start lg:items-center w-full justify-between">
					<small className="text-gray-500">
						{site?.data?.data?.data?.textLogo}
					</small>
					<small className="text-gray-500">
						&copy; {new Date().getFullYear()} All Rights Reserved.
					</small>
				</div>
			</footer>
			{!isSubscriptionActive && (
				<MadeWithLokus className="fixed bottom-1 left-0 right-0 inset-x-0 mx-auto z-50" />
			)}
		</>
	)
}

export default Footer

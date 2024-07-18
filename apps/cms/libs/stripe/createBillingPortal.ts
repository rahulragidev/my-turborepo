import getStripe from "./getStripe"

const createBillingPortal = async ({
	customerId,
}: {
	customerId: string
}): Promise<string | null> => {
	console.log("createBillingPortal response called")

	const stripe = await getStripe()
	const { url } = await fetch("/api/billing-portal/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			customerId,
		}),
	}).then(res => res.json())
	console.log("createBillingPortal url", url)

	if (!stripe) {
		console.log("stripe failed to load")
		return null
	}

	return url
}

export default createBillingPortal

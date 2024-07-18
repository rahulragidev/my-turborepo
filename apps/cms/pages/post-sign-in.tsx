import { useUser } from "@clerk/nextjs"
import createCheckout from "libs/stripe/createCheckout"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Page = () => {
	const router = useRouter()
	const { priceId } = router.query
	const { user } = useUser()

	useEffect(() => {
		if (user?.primaryEmailAddress && priceId) {
			createCheckout({
				email: user?.primaryEmailAddress?.emailAddress!,
				lineItems: [
					{
						price: priceId as string,
						quantity: 1,
					},
				],

				redirectPath: "/sites",
			})
		}
	}, [priceId, user?.primaryEmailAddress])

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<h1>Redirecting...</h1>
			<p>Taking you to stripe page.</p>
		</div>
	)
}

export default Page

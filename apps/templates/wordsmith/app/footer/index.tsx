import Button from "@/components/Button"
import MadeWithLokus from "@/components/MadeWithLokus"
import { apiEndpoint, revalidationSecretKey } from "@/config"
import getSideById from "@/libs/getSiteById"
import { gql } from "graphql-request"
import Link from "next/link"

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
    <footer className="mt-20 bg-primary">
      <div className="flex-col items-start py-16 px-4 mx-auto max-w-6xl md:px-10 xl:py-8 xl:px-40">
        <div className="flex flex-col items-start mb-20 space-y-5">
          <h1 className="text-white">Want to chat? Get in touch</h1>
          <Button>
          	<Link href={`mailto:${site?.data?.data?.data?.owner.email}`}>
          		Contact
          	</Link>
          </Button>
        </div>

        <div className="border border-b border-textDefault/30" />
        <div className="flex flex-row justify-between items-center pt-5">
					<span className='text-xs text-[#f2f2f2]'>
						{site?.data?.data?.data?.textLogo}
					</span>
          <span className="text-[#f2f2f2] text-xs">
						&copy; {new Date().getFullYear()} All Rights Reserved.
          </span>
					{/* Social Media Links */}
          {/* <div className="flex flex-row items-center space-x-3"> */}
          {/* </div> */}
        </div>
      </div>
    </footer>
    {!isSubscriptionActive && (
				<MadeWithLokus className="fixed bottom-1 left-0 right-0 inset-x-0 mx-auto z-50" />
			)}
    </>
	)
}

export default Footer

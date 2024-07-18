import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { useRouter } from "next/router"
import { useState } from "react"
import { MoonLoader } from "react-spinners"
import useSWR from "swr"
import { DeploySiteResponse } from "types/generated/types"

/**
 * Send siteId to stripe metadata when creating a subscription
 * Deploy site should call server side function to create a deploy
 * and then redirect to the site\
 * Make the API require ADMIN API key to create deploy.
 */

const DEPLOY_SITE_MUTATION = gql`
	mutation Mutation($subscriptionId: String!) {
		data: deploySite(subscriptionId: $subscriptionId) {
			message
			success
			siteId
			status {
				createdAt
				readyState
			}
		}
	}
`

const DeploySite = () => {
	const router = useRouter()
	const { subscriptionId } = router.query
	const [loadingCopy, setLoadingCopy] = useState("Deploying...")
	const { getToken, userId } = useAuth()

	const { data: deployResponse, error: deployError } = useSWR(
		["DEPLOY_SITE_MUTATION", subscriptionId, userId],
		() =>
			fetchWithToken<GraphQLResponse<DeploySiteResponse>>({
				query: DEPLOY_SITE_MUTATION,
				variables: { subscriptionId },
				getToken,
			}),
		{
			onSuccess: data => {
				console.log("deploy data", data)
				if (data.data?.success) {
					setLoadingCopy("Deployed! Redirecting...")
					router.push(`/${data.data?.siteId}`)
				} else {
					setLoadingCopy(data.data?.message || "Error!")
				}
			},
			dedupingInterval: 4000,
		}
	)

	if (deployResponse) {
		return (
			<div className="w-screen h-auto py-24 min-h-screen flex items-center justify-center">
				<div>
					<div className="max-w-4xl">
						<h1 className="text-4xl font-bold">{loadingCopy}</h1>
						<pre>{JSON.stringify(deployResponse, null, 2)}</pre>
					</div>
				</div>
			</div>
		)
	}

	if (deployError) {
		return (
			<div className="w-screen h-auto py-24 min-h-screen flex items-center justify-center">
				<div>
					<div className="max-w-4xl">
						<h1 className="text-4xl font-bold">Error!</h1>
						<pre>{JSON.stringify(deployError, null, 2)}</pre>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-screen h-auto py-24 min-h-screen flex items-center justify-center">
			<div>
				<div className="max-w-4xl flex flex-col items-center">
					<MoonLoader color="white" />
					<h1 className="text-4xl font-bold">{loadingCopy}</h1>
				</div>
			</div>
		</div>
	)
}

export default DeploySite

// @ts-ignore
// export const getServerSideProps = async context => {
// 	// console.log("req query", req)
// 	const { subscriptionId } = context.query

// 	console.log("subscriptionId", subscriptionId)
// 	// get token from user object from nextjs-auth0
// 	const session = (await getSession(context.req, context.res)) as
// 		| Session
// 		| null
// 		| undefined

// 	const deployRes = await fetchWithToken(
// 		DEPLOY_SITE_MUTATION,
// 		{
// 			subscriptionId,
// 		},
// 		session?.token as string
// 	)

// 	console.log("deployRes", deployRes)
// 	return {
// 		props: {
// 			deployRes,
// 		},
// 	}
// }

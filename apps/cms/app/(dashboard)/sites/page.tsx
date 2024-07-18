import { auth } from "@clerk/nextjs"
import SiteCard from "components/SiteCard"
import { USER_QUERY } from "dataHooks/useUser"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import Link from "next/link"
import { PlusCircle } from "react-feather"
import { UserResponse } from "types/generated/types"

const Home = async () => {
	const token = await auth().getToken({ template: "front_end_app" })

	const data = await fetchWithToken<GraphQLResponse<UserResponse>>({
		query: USER_QUERY,
		token: token!,
		next: {
			cache: "no-cache",
		},
	})

	const siteCount = data.data?.data?.sites?.length || 0
	const subscriptionStatus = data.data?.data?.subscription?.status
	// allow new site for non-active subscription or no site
	const shouldAllowNewSite = siteCount === 0 || subscriptionStatus === "active"

	return (
		<main className="py-4 px-8 mx-auto max-w-5xl min-h-[80vh] h-auto">
			<div>
				<h2 className="mb-4 text-3xl font-semibold">My Sites</h2>
			</div>

			{data && (
				<div className="grid grid-cols-1 gap-8 py-16 md:grid-cols-2 lg:grid-cols-3">
					{shouldAllowNewSite && (
						<Link href="/create">
							<div
								className="flex flex-col justify-center items-center py-8 px-4 h-full text-center rounded-2xl border-2 border-solid border-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 hover:bg-slate-300"
								key="create-site">
								<PlusCircle height="2rem" />
								<h1 className="text-2xl font-medium text-slate-500">
									Create New Site
								</h1>
							</div>
						</Link>
					)}
					{data.data?.data?.sites?.map(site => <SiteCard site={site} />)}
				</div>
			)}
		</main>
	)
}

export default Home

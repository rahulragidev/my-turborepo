import { useAuth } from "@clerk/nextjs"
import ProgressBar from "components/ProgressBar"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR from "swr"

const GET_LIBRARY_USAGE = gql`
	query myLibraryUsage {
		myLibraryUsage
	}
`

const LibraryUsage = () => {
	const { getToken, userId } = useAuth()
	const { data: usageData, error: usageError } = useSWR(
		["GET_LIBRARY_USAGE", userId],
		() =>
			fetchWithToken<GraphQLResponse<{ myLibraryUsage: number }>>({
				query: GET_LIBRARY_USAGE,
				variables: {},
				getToken,
			})
	)
	const gbUsed = usageData?.myLibraryUsage
		? (Number(usageData?.myLibraryUsage) / 1000000000).toFixed(4)
		: usageError || 0

	const gbLimit = 5
	return (
		<div className="space-y-2">
			<p className="text-slate-600">
				{/* // Convert bytes to GB */}
				{Number(gbUsed)} / {gbLimit} GB
			</p>
			<ProgressBar value={(Number(gbUsed) / gbLimit) * 100} />
		</div>
	)
}

export default LibraryUsage

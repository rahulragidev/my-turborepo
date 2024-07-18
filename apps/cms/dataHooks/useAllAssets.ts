import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { AssetsResponse } from "types/generated/types"

const GET_ALL_IMAGES_QUERY = gql`
	query AllMyAssets {
		data: allMyAssets {
			success
			message
			assets {
				id
				# owner
				slug
				key
				url
				size
				height
				width
				blurhash
			}
		}
	}
`

const useAllAssets = (): SWRResponse => {
	const { getToken, isLoaded, userId } = useAuth()
	const response = useSWR(isLoaded ? ["GET_ALL_IMAGES_QUERY", userId] : null, () =>
		fetchWithToken<GraphQLResponse<AssetsResponse>>({
			query: GET_ALL_IMAGES_QUERY,
			getToken,
		})
	)
	return response
}

export default useAllAssets

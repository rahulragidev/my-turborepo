import { gql } from "graphql-request"
import { AssetResponse } from "types/generated/types"
import fetchWithToken from "./fetchers/fetchWithToken"

const DELETE_FILE = gql`
	mutation DeleteAsset($deleteAssetId: String!) {
		response: deleteAsset(id: $deleteAssetId) {
			message
			success
			asset {
				id
			}
		}
	}
`

const deleteFile = async (
	deleteAssetId: string,
	token: string
): Promise<AssetResponse> => {
	const response = await fetchWithToken<AssetResponse>({
		query: DELETE_FILE,
		variables: { deleteAssetId },
		token,
	})
	return response
}

export default deleteFile

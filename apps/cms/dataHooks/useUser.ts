/**
 * useUserData.js hook function
 *
 * Reusable Hook that fetches user data using useSWR.
 * @params {token} user.token
 * returns @user @error @isLoading @userMutation (bound mutate for this useSWR call)
 *
 */

import { useAuth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import useSWR, { SWRResponse } from "swr"
import { UserResponse } from "types/generated/types"

export const USER_QUERY = gql`
	query Me {
		data: me {
			success
			message
			data {
				id
				email
				onboardingState
				name
				subscription {
					id
					status
					customer
					currentPlan {
						livemode
						active
						id
						nickname
					}
				}
				sites {
					# uid
					id
					name
					slug
					setup
					url
					pages {
						id
						name
						slug
						children {
							id
							name
							slug
						}
					}
				}
			}
		}
	}
`

const useUserData = (): SWRResponse<GraphQLResponse<UserResponse>> => {
	const { getToken, userId } = useAuth()
	const response = useSWR(userId ? [USER_QUERY, userId] : null, () =>
		fetchWithToken<GraphQLResponse<UserResponse>>({
			query: USER_QUERY,
			variables: {},
			getToken,
		})
	)

	return response
}

export default useUserData

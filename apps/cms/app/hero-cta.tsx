import { auth } from "@clerk/nextjs"
import Button from "components/Button"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { ArrowRight } from "lucide-react"
import { UserResponse } from "types/generated/types"

const GET_NO_OF_SITES = gql`
    query {
        data: me {
            success
            message
            data {
                sites {
                    id
                }
            }
        }
    }
`

const getNoOfSites = async (): Promise<number | null> => {
    const token = await auth().getToken({ template: "front_end_app " })
    // console.log("getNoOfSites -> token", token)
    if (!token) return null

    const userResponse = await fetchWithToken<GraphQLResponse<UserResponse>>({
        query: GET_NO_OF_SITES,
        token,
        next: {
            cache: "no-cache"
        }
    })
    // console.log("getNoOfSites -> sites", userResponse)
    if (!userResponse) return null

    // console.log("getNoOfSites -> sites", userResponse.data?.data?.sites?.length ?? null)
    return userResponse?.data?.data?.sites?.length ?? null
}

const HeroCta = async () => {
    const numberOfCurrentSites = await getNoOfSites()
    if (numberOfCurrentSites) {
        if (numberOfCurrentSites > 1) {
            return (
                <Button
                    href="/sites"
                    className="text-xl px-8 py-3 rounded-full">
                    <span>Go to my Sites</span>
                    <ArrowRight />
                </Button>
            )
        }
        return (
            <Button href="/create" className="text-xl px-8 py-3 rounded-full">
                <span>Create a new site</span>
                <ArrowRight />
            </Button>
        )
    }

    return (
        <Button href="/create" className="text-xl px-8 py-3 rounded-full">
            <span>Create a new site</span>
            <ArrowRight />
        </Button>
    )
}

export default HeroCta

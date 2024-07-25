import { auth } from "@clerk/nextjs"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { notFound } from "next/navigation"
import { PageFilterEnum, PageResponse } from "types/generated/types"
import PageView from "./page-view"

const GET_PAGE_BY_SLUG = gql`
    query ($siteId: String!, $slug: String!, $filter: PageFilterEnum) {
        data: getPageBySlug(slug: $slug, siteId: $siteId, filter: $filter) {
            success
            message
            statusCode
            data {
                id
                name
                slug
                body
                draftBody
                jsonBody
                jsonDraftBody
                isPublic
                createdAt
                updatedAt
                lastPublishedAt
                priority
                isFeatured
                parent {
                    id
                    slug
                    isPublic
                    createdAt
                    updatedAt
                    lastPublishedAt
                    priority
                }
                children {
                    id
                    name
                    slug
                    priority
                    isPublic
                }
            }
        }
    }
`

const getPageBySlug = async ({
    slug,
    siteId,
    token
}: {
    slug: string
    siteId: string
    token: string
}): Promise<GraphQLResponse<PageResponse>> => {
    try {
        // console.log("called getPageBySlug")
        const page = await fetchWithToken<GraphQLResponse<PageResponse>>({
            query: GET_PAGE_BY_SLUG,
            variables: {
                slug,
                siteId,
                filter: PageFilterEnum.Any
            },
            token,
            next: {
                tags: [`${slug}-${siteId}`]
            }
        })
        return page
    } catch (error: any) {
        console.error("getPageBySlug Error", error)
        return error
    }
}

const Page = async ({
    params
}: {
    params: { siteId: string; pageSlug: string[] }
}) => {
    const { getToken, userId } = await auth()
    const token = await getToken({ template: "front_end_app" })

    console.log("pageSlug", params.pageSlug)

    const slug = () => {
        // if params.pageSlug is empty or undefined, return "index"
        if (!params.pageSlug || params.pageSlug.length === 0) {
            // console.log("slug", "index")
            return "index"
        }
        // if params.pageSlug is not empty, return the last item in the array
        // console.log("slug", params.pageSlug[params.pageSlug.length - 1])
        return params.pageSlug[params.pageSlug.length - 1]
    }

    // if pageSlug is not new, return the editor
    const pageResponse = await getPageBySlug({
        slug: slug() || "",
        siteId: params.siteId,
        token: token!
    })

    // console.log("-------------------------------------------------")
    // console.log("Page Name:", pageResponse.data?.data?.name)
    // console.log("-------------------------------------------------\n")
    // console.log(
    //	"jsonDraftBody",
    //	JSON.stringify(pageResponse.data?.data?.jsonDraftBody, null, 2)
    // )
    // console.log("jsonBody", JSON.stringify(pageResponse.data?.data?.jsonBody, null, 2))

    if (!pageResponse || !pageResponse.data?.success) {
        return notFound()
    }

    const page = pageResponse.data?.data!

    return (
        <PageView
            token={token!}
            page={page}
            userId={userId as string}
            siteId={params.siteId as string}
            pageSlug={slug() || ""}
        />
    )
}

export default Page

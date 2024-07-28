"use client"

import { Editor, JSONContent } from "@tiptap/core"
import NovelEditor from "components/editor"
import { setImageUploadToken } from "components/editor/plugins/upload-images"
import { useMinimizeMaximize } from "contexts/MinimizeMaximizeContext"
import usePageBySlug from "dataHooks/usePage"
import { motion } from "framer-motion"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import { cn } from "@repo/utils/src/cn"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { Page, PageResponse, UpdatePageInput } from "types/generated/types"
import PageToolBar from "./components/page-tool-bar"

// export type JSONContent = {
//    type?: string
//    attrs?: Record<string, any>
//    content?: JSONContent[]
//    marks?: {
//        type: string
//        attrs?: Record<string, any>
//        [key: string]: any
//    }[]
//    text?: string
//    [key: string]: any
// }

const UPDATE_PAGE_MUTATION = gql`
    mutation updatePages($data: UpdatePageInput!, $id: String!) {
        data: updatePage(data: $data, id: $id) {
            success
            message
            data {
                name
                id
                body
                isPublic
                body
                draftBody
                jsonBody
                jsonDraftBody
                createdAt
                updatedAt
                lastPublishedAt
            }
        }
    }
`

const PageView = ({
    token,
    page,
    userId,
    siteId,
    pageSlug
}: {
    token: string
    page: Page
    userId: string
    siteId: string
    pageSlug: string
}) => {
    const { mutate: pageMutate } = usePageBySlug({})

    const { isMinimized } = useMinimizeMaximize()
    useEffect(() => {
        // this will set the token inside upload-images.ts tiptap custom plugin.
        setImageUploadToken(token)
    }, [token])

    const updatePage = useCallback(
        async ({
            draftBody,
            jsonDraftBody
        }: {
            draftBody?: string
            jsonDraftBody: JSONContent
        }): Promise<GraphQLResponse<PageResponse>> => {
            // console.log("Update page called")
            try {
                const payload: UpdatePageInput = {
                    draftBody,
                    jsonDraftBody
                }

                const response = await fetchWithToken<
                    GraphQLResponse<PageResponse>
                >({
                    query: UPDATE_PAGE_MUTATION,
                    variables: {
                        id: page.id,
                        data: payload
                    },
                    token
                })
                pageMutate()
                return response
            } catch (error: any) {
                console.log("Errror updating page", error)
                toast.error(error.message || "Error updating page")
                return error
            }
        },
        [token, page.id, pageMutate]
    )

    const handleUpdate = useCallback(
        (editor?: Editor) => {
            if (editor) {
                // console.log("handleUpdate", editor.getHTML())
                // console.log(editor.getJSON())
                console.groupCollapsed("handleUpdate")
                // console.log("draftBody", editor.getHTML())
                console.log("jsonDraftBody", editor.getJSON())
                console.groupEnd()

                updatePage({
                    // draftBody: editor.getHTML(),
                    jsonDraftBody: editor.getJSON()
                })
            }
        },
        [updatePage]
    )

    const defaultValue = useCallback(() => {
        if (page.jsonDraftBody) {
            return page.jsonDraftBody as JSONContent
        }
        return page.draftBody as string
    }, [page.jsonDraftBody, page.draftBody])

    return (
        <motion.main
            className={cn(
                "min-h-screen",
                isMinimized ? "w-full" : "w-full md:w-[calc(100%-20rem)]"
            )}
            initial={false}
            animate={{
                x: isMinimized ? 0 : "20rem"
            }}
            transition={{
                bounce: 0
            }}>
            <PageToolBar token={token} />
            <NovelEditor
                editorProps={{
                    attributes: {
                        pageId: page.id,
                        siteId,
                        pageSlug,
                        userId,
                        token
                    }
                }}
                // token={token}
                defaultValue={defaultValue()}
                storageKey={`page-draftbody-${page.id}`}
                disableLocalStorage
                onDebouncedUpdate={value => handleUpdate(value)}
                key={page.id}
            />
        </motion.main>
    )
}

export default PageView

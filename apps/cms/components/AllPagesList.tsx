"use client"

import { Editor } from "@tiptap/core"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { useCallback, useEffect, useState } from "react"
import { Feather } from "react-feather"
import useSWR from "swr"
import { Page, PageResponse, PagesResponse } from "types/generated/types"

const GET_ALL_PAGES = gql`
	query getAllPages($siteId: String!) {
		data: getAllPagesBySite(siteId: $siteId) {
			message
			statusCode
			success
			data {
				id
				name
				slug
				createdAt
				updatedAt
				isPublic
			}
		}
	}
`

const ASSIGN_PARENT = gql`
	mutation AssignParent($parentId: String!, $pageId: String!) {
		data: assignParent(parentId: $parentId, pageId: $pageId) {
			success
			message
			data {
				id
				slug
				name
				parent {
					id
					name
					slug
				}
			}
		}
	}
`

const CREATE_PAGE = gql`
	mutation createPage($name: String!, $siteId: String!, $parent: String) {
		data: createPage(name: $name, siteId: $siteId, parent: $parent) {
			message
			success
			data {
				id
				name
				slug
				parent {
					id
					name
					slug
				}
			}
		}
	}
`

const AllPagesList = ({
	handlePageSelection,
	editor,
}: {
	handlePageSelection: (_page: Page) => void
	editor: Editor
}) => {
	const [searchString, setSearchString] = useState("")

	// get the token from the editorProps.attributes. This is set onCreate of the editor.
	// @ts-expect-error custom type hasn't been added yet
	const token = editor?.options?.editorProps?.attributes?.token
	// @ts-expect-error custom type hasn't been added yet
	const siteId = editor?.options?.editorProps?.attributes?.siteId
	// @ts-expect-error custom type hasn't been added yet
	const pageSlug = editor?.options?.editorProps?.attributes?.pageSlug
	// @ts-expect-error custom type hasn't been added yet
	const userId = editor?.options?.editorProps?.attributes?.userId

	// get the current Page ID
	// @ts-expect-error custom type hasn't been added yet
	const parentId = editor.options.editorProps.attributes.pageId

	const [pages, setPages] = useState<Page[]>([])

	const { data, error } = useSWR(
		[GET_ALL_PAGES, siteId, userId],
		() =>
			fetchWithToken<GraphQLResponse<PagesResponse>>({
				query: GET_ALL_PAGES,
				variables: { siteId },
				token,
			}),
		{
			onSuccess: data => {
				console.log("data", data)
				if (data?.data?.success) {
					setPages(data.data.data as Page[])
				}
			},
		}
	)

	const assignParent = useCallback(
		async (page: Page) => {
			try {
				const result = await fetchWithToken<GraphQLResponse<PageResponse>>({
					query: ASSIGN_PARENT,
					variables: { parentId, pageId: page.id },
					token,
				})
				console.log("assignParent result", result)
				debugger
				if (result?.data?.success) {
					handlePageSelection(result.data.data as Page)
				}
			} catch (e) {
				console.error("Error assigning parent to page", e)
			}
		},
		[parentId, token, handlePageSelection]
	)

	const handleCreatePage = useCallback(async () => {
		try {
			const result = await fetchWithToken<GraphQLResponse<PageResponse>>({
				query: CREATE_PAGE,
				variables: { siteId, name: searchString, parent: parentId },
				token,
			})

			if (result?.data?.success) {
				handlePageSelection(result.data.data as Page)
			}
		} catch (e) {
			console.error("Error creating page", e)
		}
	}, [siteId, searchString, parentId, token, handlePageSelection])

	useEffect(() => {
		if (data?.data?.success) {
			if (searchString === "") {
				setPages(data.data.data as Page[])
			} else {
				const updatePages = pages.filter(page =>
					page.name.toLowerCase().includes(searchString.toLowerCase())
				)
				setPages(updatePages)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchString, data])

	return (
		<div className="relative w-full text-slate-100 max-h-[50vh] overflow-y-scroll">
			<div className="w-full mb-2 px-4 py-4 sticky top-0 left-0 bg-slate-950/10 backdrop-blur-sm rounded-t-lg">
				<h2 className="text-2xl mb-2 tracking-tight max-w-md px-2 ">
					Select a page or create a new one
				</h2>
				<input
					placeholder="Search for existing pages"
					value={searchString}
					onChange={e => setSearchString(e.target.value)}
					className="w-full appearance-none bg-slate-800 text-slate-200 px-2 py-2 rounded-md"
					type="text"
				/>
			</div>
			<ul className="text-slate-200 text-lg font-medium tracking-tight">
				{pages
					.filter(page => page.slug.toString() !== pageSlug?.toString())
					.filter(page => page.slug.toString() !== "index")
					.map(page => (
						<li
							className="flex items-center justify-between py-2 px-6 w-full hover:bg-slate-800/30 cursor-pointer"
							key={page.id}>
							<button type="button" onClick={() => assignParent(page)}>
								{page.name}
							</button>
							{!page.isPublic && (
								<div className="flex items-center justify-between px-2 py-1 rounded-full bg-slate-800/50">
									{" "}
									<Feather height={16} />
									<span className="text-sm px-1">Private</span>{" "}
								</div>
							)}
						</li>
					))}
			</ul>
			{pages.length === 0 && (
				<div>
					<p className="text-slate-600">No pages found</p>
					<button type="button" onClick={() => handleCreatePage()}>
						Create a new page
					</button>
				</div>
			)}
			{error && <p>{error.message || error}</p>}
		</div>
	)
}

export default AllPagesList

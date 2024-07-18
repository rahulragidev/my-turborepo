"use client"

import { useAuth } from "@clerk/nextjs"
import usePageBySlug from "dataHooks/usePage"
import useSite from "dataHooks/useSite"
import { gql } from "graphql-request"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import Slugify from "libs/slugify"
import { CheckCircle2Icon, EyeOff, Lock, Settings, X } from "lucide-react"
import { DateTime } from "luxon"
import { useParams, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import { match } from "ts-pattern"
import { Page, PageResponse, UpdatePageInput } from "types/generated/types"
import Button from "../../../../../components/Button"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "../../../../../components/layouts/Sheet"

const UPDATE_PAGE_MUTATION = gql`
	mutation updatePage($data: UpdatePageInput!, $id: String!) {
		data: updatePage(data: $data, id: $id) {
			success
			message
			data {
				name
				id
				body
				isPublic
				draftBody
				jsonDraftBody
				body
				jsonBody
				createdAt
				updatedAt
				lastPublishedAt
			}
		}
	}
`

const DELELTE_PAGE_MUTATION = gql`
	mutation deletePage($id: String!) {
		data: deletePage(id: $id) {
			success
			message
		}
	}
`

const PageSettings = () => {
	const router = useRouter()
	const { getToken } = useAuth()
	const { siteId } = useParams<{ siteId: string }>() ?? {}
	const { data: siteData } = useSite(siteId as string)
	const [localPage, setLocalPage] = useState({} as Page)
	const [deletePageName, setDeletePageName] = useState("")
	const [isUpdating, setIsUpdating] = useState(false)

	const { data, error, mutate } = usePageBySlug({})

	useEffect(() => {
		if (data?.data?.success) {
			setLocalPage(data?.data?.data as Page)
		}
	}, [data?.data?.data, data?.data?.success])
	const timestamps = useMemo(
		() => ({
			createdAt: DateTime.fromISO(data?.data?.data?.createdAt).toFormat(
				"LLL dd, yyyy, hh:mm a"
			),
			updatedAt: DateTime.fromISO(data?.data?.data?.updatedAt).toRelative(),
			publishedAt: DateTime.fromISO(data?.data?.data?.lastPublishedAt).toRelative(),
		}),
		[data]
	)

	const handleChange = useCallback(
		(
			e:
				| React.ChangeEvent<HTMLInputElement>
				| React.ChangeEvent<HTMLTextAreaElement>
		) => {
			if (e.target.name === "slug") {
				setLocalPage({
					...localPage,
					[e.target.name]: Slugify(e.target.value, 50),
				})
			} else {
				setLocalPage({
					...localPage,
					[e.target.name]: e.target.value,
				})
			}
		},
		[localPage]
	)

	const updatePage = async (): Promise<PageResponse> => {
		const payload: UpdatePageInput = {
			name: localPage.name as string,
			slug: localPage.slug,
			metaDescription: localPage.metaDescription,
			metaTitle: localPage.metaTitle ? localPage.metaTitle : localPage.name,
		}
		try {
			setIsUpdating(true)
			const { data } = await fetchWithToken<GraphQLResponse<PageResponse>>({
				query: UPDATE_PAGE_MUTATION,
				variables: { id: localPage.id, data: payload },
				getToken,
			})
			setIsUpdating(false)
			mutate()
			return data!
		} catch (error: any) {
			setIsUpdating(false)
			console.error(error)
			return error
		}
	}

	const deletePage = async (): Promise<PageResponse> => {
		try {
			// Don't delete the Index page
			if (localPage.slug === "index") throw Error("Cannot delete index page")

			// Delete the page
			const { data } = await fetchWithToken<GraphQLResponse<PageResponse>>({
				query: DELELTE_PAGE_MUTATION,
				variables: { id: localPage.id },
				getToken,
			})

			if (data?.success) {
				router.push(`/${siteId}`)
			}
			mutate()

			return data!
		} catch (error: any) {
			return error
		}
	}

	const handleDeletePage = async () => {
		if (
			// eslint-disable-next-line no-alert
			window.confirm(
				`Are you sure you want to delete ${localPage.name}? \n This will delete this page and all it's sub pages`
			)
		) {
			toast.promise(deletePage(), {
				loading: "Deleting Page",
				success: data => {
					if (data?.success) {
						mutate()
						return `${data?.message}`
					}
					return "Page Deleted"
				},
				error: data => data?.data?.message ?? "Something went wrong",
			})
		}
	}

	// Reset deletePageName on pageSlug change, and on open
	// if (!data && !error) {
	// 	return (
	// 		<Sheet>
	// 			<Loader className="animate-spin" height={16} />
	// 		</Sheet>
	// 	)
	// }

	return (
		<Sheet
			onOpenChange={open => {
				if (!open) {
					setDeletePageName("")
					setLocalPage(data?.data?.data as Page)
				}
			}}>
			<SheetTrigger
				className="disabled:animate-pulse disabled:cursor-loading rounded-full hover:bg-gray-300/50 p-2 h-10 w-10 flex items-center justify-center"
				disabled={!data && !error}>
				<Settings size={16} />
			</SheetTrigger>
			<SheetContent>
				{/* Header */}
				<div className="flex justify-between items-center py-6 px-12 w-full border-b border-slate-900">
					<SheetTitle>
						<h2 className="text-xl font-semibold tracking-tight">
							Page Settings
						</h2>
						<p>{localPage.id}</p>
					</SheetTitle>
					<SheetClose>
						<Button variant="tertiary" rounded>
							<X size={24} />
							<span className="sr-only">Close</span>
						</Button>
					</SheetClose>
				</div>
				{/* General Section */}
				<div className="py-6 px-10 w-full border-b border-slate-900">
					<h3 className="ml-2 text-sm tracking-widest uppercase">
						General Settings
					</h3>
					{/* Name */}
					<fieldset className="mt-8 w-full">
						<div className="flex justify-between items-center px-2">
							<label>Name</label>
							<span>{localPage.name?.length} / 50</span>
						</div>
						<div className="relative">
							<input
								disabled={localPage.slug === "index"}
								maxLength={50}
								className="relative p-2 w-full rounded-md border border-slate-600 bg-transparent text-slate-200"
								type="text"
								name="name"
								onChange={handleChange}
								value={localPage.name}
							/>
							{localPage.slug === "index" && (
								<div className="flex items-center space-x-1 absolute top-[20%] right-2">
									<Lock height={12} />
									<p className="my-1 ml-2 text-sm text-slate-400">
										Read Only
									</p>
								</div>
							)}
						</div>
					</fieldset>

					<div className="mt-8 ml-2 w-full">
						<p>Slug</p>
						<div className="flex items-center w-fit">
							<p>
								<span className="mr-2 text-slate-700">
									{siteData?.data?.data?.primaryDomain} /
								</span>
								{localPage.slug}
							</p>
							{localPage.slug === "index" && <Lock height={12} />}
						</div>
					</div>
					{/* Status */}
					<div className="mt-8 space-y-2 w-full">
						<h4 className="ml-1">Current Status</h4>
						<div className="flex items-center space-x-2">
							{localPage.isPublic ? (
								<CheckCircle2Icon
									className="text-green-500"
									height={18}
								/>
							) : (
								<EyeOff className="text-amber-500" height={18} />
							)}
							<p className="space-x-2 text-slate-400">
								<span>
									{match(localPage)
										.when(
											p =>
												p.isPublic === true &&
												p.body !== p.draftBody,
											() =>
												"Page is public, but you have unpublished changes"
										)
										.when(
											p =>
												p.isPublic === true &&
												p.body === p.draftBody,
											() =>
												"Page is public. All content is up to date"
										)
										.when(
											p => !p.isPublic,
											() =>
												"Page is private. Not displayed on your site"
										)
										.otherwise(() => "")}
								</span>
							</p>
						</div>
					</div>
				</div>
				{/* SEO section */}
				<div className="py-6 px-10 w-full border-b border-slate-900">
					<h3 className="ml-2 text-sm tracking-widest uppercase">
						SEO Settings
					</h3>
					{/* Meta Title */}
					<fieldset className="mt-8 w-full">
						<div className="flex justify-between items-center px-2">
							<label>Meta Title</label>
							<span>{localPage.metaTitle?.length || "0"} / 50</span>
						</div>
						<div className="relative">
							<input
								maxLength={50}
								className="relative p-2 w-full rounded-md border border-slate-600 bg-transparent text-slate-200"
								type="text"
								name="metaTitle"
								value={localPage.metaTitle as string}
								onChange={handleChange}
							/>
						</div>
					</fieldset>

					{/* Meta Description */}
					<fieldset className="mt-8 w-full">
						<div className="flex justify-between items-center px-2">
							<label>Meta Description</label>
							<span>{localPage.metaDescription?.length || "0"} / 200</span>
						</div>
						<div className="relative">
							<textarea
								maxLength={200}
								className="relative p-2 w-full rounded-md border border-slate-600 bg-transparent text-slate-200 min-h-24"
								name="metaDescription"
								value={localPage.metaDescription as string}
								onChange={handleChange}
							/>
						</div>
					</fieldset>
				</div>

				{/* Timestamps */}
				<div className="py-6 px-10 space-y-4 w-full border-b border-slate-900">
					<div>
						<p className="text-sm text-slate-500">Last Save</p>
						<p>{timestamps.updatedAt}</p>
					</div>
					<div>
						<p className="text-sm text-slate-500">Last Publish</p>
						<p>{timestamps.publishedAt}</p>
					</div>
					<div>
						<p className="text-sm text-slate-500">Created</p>
						<p>{timestamps.createdAt}</p>
					</div>
				</div>

				{/* Delecte Section. Hide in Index Page */}
				{localPage.slug !== "index" && (
					<div className="flex flex-col gap-2 py-6 px-10 w-full border-b border-slate-900">
						<div className="space-y-2">
							<h3 className="tracking-widest text-red-400 uppercase">
								Delete Page
							</h3>
							<p className="text-red-500">
								Deleting a page is permanent and cannot be undone.
							</p>
						</div>
						{/* Delete Page */}
						<fieldset className="flex flex-col gap-2 mt-4 w-full">
							<label htmlFor="delete" className="text-left">
								Please enter the page name to delete:
							</label>

							<input
								id="delete"
								placeholder={data?.data?.data?.name}
								maxLength={50}
								className="p-2 w-full rounded-md border border-slate-600 placeholder:text-slate-400/40"
								type="text"
								name="delete"
								onChange={e => setDeletePageName(e.target.value)}
							/>
						</fieldset>
					</div>
				)}
				{/* CTA */}
				{deletePageName === data?.data?.data?.name ? (
					<div className="flex sticky bottom-0 justify-end items-center py-6 px-12 space-x-2 w-full border-y border-slate-800/60">
						<Button variant="danger" onClick={() => handleDeletePage()}>
							Delete Page
						</Button>
					</div>
				) : (
					<div className="flex sticky bottom-0 justify-end items-center py-6 px-12 space-x-2 w-full border-y bg-slate-950 border-slate-800/60">
						{!isUpdating && (
							<Button
								variant="secondary"
								onClick={() => {
									console.log("Clear changes")
									setLocalPage(data?.data?.data as Page)
								}}>
								Reset Changes
							</Button>
						)}
						<Button loading={isUpdating} onClick={() => updatePage()}>
							Save Changes
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}

export default PageSettings

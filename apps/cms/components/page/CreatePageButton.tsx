"use client"

import { useAuth } from "@clerk/nextjs"
import {
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@radix-ui/react-alert-dialog"
import useRootPage from "dataHooks/useRootPage"
import useSite from "dataHooks/useSite"
import useUserData from "dataHooks/useUser"
import { cn } from "lib/utils"
import createPage from "libs/fetchers/page/createPage"
import { ArrowRight } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { Loader, Plus } from "react-feather"
import { useForm } from "react-hook-form"
import Button from "../Button"
import CustomAlertDialog from "../layouts/CustomAlertDialog"

const CreatePageButton = ({ className }: { className?: string }) => {
	const { getToken } = useAuth()
	const router = useRouter()
	const params = useParams<{ siteId: string }>()
	const [isPending, startTransition] = useTransition()
	const [isDialogOpen, setDialogOpen] = useState(false)
	const { register, formState, setError, handleSubmit } = useForm<{ name: string }>({
		mode: "all",
		shouldFocusError: true,
	})

	const { mutate: mutateRootPage } = useRootPage(params?.siteId as string)

	const { data: siteData } = useSite(params?.siteId as string)

	const { data: userData } = useUserData()

	const isLoading = isPending || formState.isSubmitting

	const onSubmit = useCallback(
		async ({ name }: { name: string }) => {
			const token = (await getToken({ template: "front_end_app" })) as string
			try {
				const response = await createPage({
					name,
					siteId: params?.siteId as string,
					token,
				})

				if (!response?.data?.success) return

				mutateRootPage()
				startTransition(() => {
					router.push(`/${params?.siteId}/${response.data?.data?.slug}`)
				})
			} catch (error) {
				console.error(error)

				const errorMessage =
					error instanceof Error ? error.message : (error as string)

				setError("name", {
					type: "manual",
					message: errorMessage,
				})
			}
		},
		[params, getToken, mutateRootPage, setError, router]
	)

	const renderForm = useCallback(() => {
		const allowedToCreatePage =
			(siteData?.data?.data?.pages?.length &&
				siteData?.data?.data?.pages?.length < 4) ||
			userData?.data?.data?.subscription?.status === "active"

		if (allowedToCreatePage) {
			return (
				<>
					<AlertDialogTitle className="max-w-xs text-2xl text-slate-200">
						Create New Page
					</AlertDialogTitle>
					<AlertDialogDescription className="text-sm text-slate-300">
						{/* Creative line here to ask users to give a unique page name */}
						Enter a unique name for your new page
					</AlertDialogDescription>

					<form onSubmit={handleSubmit(onSubmit)}>
						<input
							type="text"
							placeholder="Enter name"
							className="py-2 px-3 mt-4 w-full rounded-md border focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-100 border-slate-500"
							{...register("name", {
								required: true,
							})}
						/>

						<div className="flex justify-end mt-4 space-x-2 w-full">
							<AlertDialogCancel asChild>
								<Button variant="tertiary">Cancel</Button>
							</AlertDialogCancel>

							<Button
								variant="primary"
								type="submit"
								loading={isPending || formState.isSubmitting}>
								{!isLoading && (
									<span className="mt-[2px]">Create Page</span>
								)}
							</Button>
						</div>
					</form>
				</>
			)
		}
		return (
			<>
				<AlertDialogTitle className="max-w-xs text-2xl text-slate-200">
					Subscribe to Create New Page
				</AlertDialogTitle>
				<AlertDialogDescription className="text-sm text-slate-300">
					{/* Creative line here to ask users to give a unique page name */}
					You&apos;ve reached the limit of 3 pages. Please subscribe to create
					more pages.
				</AlertDialogDescription>
				<div className="flex justify-end mt-4 space-x-2 w-full">
					<AlertDialogCancel asChild>
						<Button variant="tertiary">Cancel</Button>
					</AlertDialogCancel>
					<Button variant="primary" onClick={() => router.push("/pricing")}>
						<p>Subscribe Now</p>
						<ArrowRight />
					</Button>
				</div>
			</>
		)
	}, [
		formState.isSubmitting,
		handleSubmit,
		isLoading,
		isPending,
		onSubmit,
		register,
		router,
		siteData?.data?.data?.pages?.length,
		userData?.data?.data?.subscription?.status,
	])

	return (
		<CustomAlertDialog
			open={isDialogOpen}
			onOpenChange={setDialogOpen}
			triggerButton={
				<button
					aria-label="Create new page"
					disabled={isLoading}
					type="button"
					className={cn(
						"flex justify-between flex-nowrap items-center py-2 text-slate-200 hover:bg-slate-800/75 px-4 w-full space-x-1",
						className
					)}>
					{isLoading ? (
						<Loader height={16} className="animate-spin" />
					) : (
						<>
							<p className="font-medium tracking-tight whitespace-nowrap">
								New Page
							</p>
							<Plus height={16} />
						</>
					)}
				</button>
			}>
			{renderForm()}
		</CustomAlertDialog>
	)
}

export default CreatePageButton

"use client"

import { useAuth } from "@clerk/nextjs"
import { Portal } from "@radix-ui/react-portal"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import { motion } from "framer-motion"
import { cn } from "lib/utils"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import Confetti from "react-confetti"
import toast from "react-hot-toast"
import { useWindowSize } from "usehooks-ts"
import createSite from "../functions/create-site"

const MotionButton = motion(Button)

const CreateSiteButton = ({
	isDisabled,
	siteName,
	templateId,
	isLoading,
	className,
}: {
	isDisabled?: boolean
	isLoading?: boolean
	siteName: string
	templateId: string
	className?: string
}) => {
	const router = useRouter()
	const { getToken } = useAuth()
	const windowSize = useWindowSize()
	const [isPending, startTransition] = useTransition()

	// this is useful to prevent button click while route is changing.

	const [isCreating, setIsCreating] = useState(false)
	const siteId = useRef<string | undefined>()

	const handleCreateSite = async () => {
		// createSite
		const create = createSite.bind(createSite, getToken)
		let toastId: string | null = null

		// eslint-disable-next-line no-restricted-syntax
		for await (const res of create(siteName, templateId)) {
			if (toastId) toast.dismiss(toastId)

			switch (res.status) {
				case "created":
					setIsCreating(false)
					toastId = toast.success("Site created successfully!")
					siteId.current = res.id
					break
				case "error":
					setIsCreating(false)
					toastId = toast.error(res.message)
					break
				default:
					toastId = toast.loading("Creating site...")
					setIsCreating(true)
					break
			}
		}
	}

	return (
		<>
			{/* Button (Trigger) */}
			<MotionButton
				disabled={isDisabled}
				loading={isLoading || isCreating}
				exit={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					"flex items-center py-2 px-4 space-x-2 text-white bg-blue-500 rounded-lg",
					isLoading && "cursor-progress bg-blue-400 opacity-75",
					className
				)}
				onClick={handleCreateSite}>
				<span className="text-lg">Create Site</span>
			</MotionButton>

			{/* The Dialog Box */}
			<CustomDialogBox open={!!siteId.current}>
				<div className="p-6 space-y-4">
					<h1 className="text-4xl font-medium tracking-tight text-slate-200">
						Site Created!
					</h1>
					<p className="text-xl text-slate-400">
						Your site has been created! You can now go to the dashboard and
						manage your site.
					</p>
					<div className="flex justify-end items-center">
						<Button
							loading={isPending}
							variant="secondary"
							onClick={() =>
								startTransition(() => router.push(`/${siteId.current}`))
							}>
							Go to Site Dashboard
						</Button>
						{/* <Button
							disabled={isPending}
							variant="primary"
							className="space-x-2"
							onClick={() => console.log("Launch Site")}>
							<Rocket />
							<span>Launch Site</span>
						</Button> */}
					</div>
				</div>
			</CustomDialogBox>

			{/* Confetti */}

			<Portal>
				<Confetti
					tweenDuration={0.5}
					className="top-0 left-0"
					width={windowSize.width}
					height={windowSize.height}
					run={!!siteId.current}
				/>
			</Portal>
		</>
	)
}

export default CreateSiteButton

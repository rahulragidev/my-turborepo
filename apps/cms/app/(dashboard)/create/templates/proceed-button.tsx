"use client"

import { AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import CreateSiteButton from "../components/create-site-button"

const ProceedButton = ({ className }: { className?: string }) => {
	const searchParams = useSearchParams()
	const templateId = searchParams?.get("templateId") ?? ""
	const siteName = searchParams?.get("siteName") ?? ""

	return (
		<AnimatePresence>
			{templateId && siteName && (
				<CreateSiteButton
					className={className}
					siteName={siteName}
					templateId={templateId}
				/>
			)}
		</AnimatePresence>
	)
}

export default ProceedButton

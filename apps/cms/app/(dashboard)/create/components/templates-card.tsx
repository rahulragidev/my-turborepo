"use client"

import getSymbolFromCurrency from "currency-symbol-map"
import { cn } from "lib/utils"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Template } from "types/generated/types"

interface Props {
	template: Template
}

const TemplateCard = ({ template }: Props) => {
	const searchParams = useSearchParams()
	const templateId = searchParams?.get("templateId") ?? ""
	const siteName = searchParams?.get("siteName") ?? ""

	const classes = cn(
		"relative flex flex-col justify-between text-left rounded-2xl bg-slate-800/75 h-[24rem] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-4",
		templateId === template.id && "shadow-lg ring-4 ring-blue-500"
	)

	return (
		<div className={classes}>
			<Link
				replace
				className="flex flex-col justify-between w-full h-[80%]"
				href={`?templateId=${template.id}&siteName=${siteName}`}
				key={template.id}>
				<div className="overflow-hidden relative w-full h-[62%]">
					<Image
						className="object-cover w-full h-full aspect-auto"
						src={(template?.bannerImage as string) || ""}
						alt={template.name}
						fill
					/>
				</div>

				{/* Name link and Price */}
				<div className="flex flex-1 justify-between items-center pt-8 px-4 ">
					<div>
						<h2 className="text-2xl font-semibold">{template.name}</h2>
						{template.stripeProduct ? (
							<h3>
								{getSymbolFromCurrency(
									template.stripeProduct?.default_price
										?.currency as string
								)}{" "}
								{Number(
									template.stripeProduct?.default_price?.unit_amount
								) / 100}
							</h3>
						) : (
							<h3>Free</h3>
						)}
					</div>
				</div>
			</Link>
			{template.demoLink && (
				<a
					href={template.demoLink}
					target="_blank"
					className="flex gap-2 items-center justify-between bg-slate-800 w-full px-4 py-4 hover:bg-slate-900 transition-colors"
					rel="noreferrer">
					<span>View Demo</span>
					<ArrowUpRight />
				</a>
			)}
		</div>
	)
}

export default TemplateCard

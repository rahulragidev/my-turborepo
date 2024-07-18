"use client"

import { Lock } from "lucide-react"
import { Site } from "types/generated/types"

interface Props {
	site: Site
}

const UpdateSiteNameForm = ({ site }: Props) => {
	return (
		<div className="py-8 px-8 pt-4 space-y-2 w-full rounded-xl bg-slate-900">
			<h3 className="text-2xl">Site Name</h3>
			<div className="w-fit flex items-center space-x-1 mt-6">
				<Lock height={16} />
				<h4 className="text-xl">{site.slug}</h4>
			</div>
		</div>
	)
}

export default UpdateSiteNameForm

"use client"

import { Template } from "types/generated/types"
import TemplateCard from "./templates-card"

const TemplatesList = ({ templates }: { templates: Template[] }) => {
	// get Params

	return (
		<div className="grid grid-cols-1 gap-12 py-12 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{templates.map(template => (
				<TemplateCard key={template.id} template={template} />
			))}
		</div>
	)
}

export default TemplatesList

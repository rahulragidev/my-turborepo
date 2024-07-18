"use client"

import Field from "components/form/Field"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFormState } from "react-dom"
import toast from "react-hot-toast"
import { Site } from "types/generated/types"
import * as actions from "../actions"
import { FormRoot } from "./section-wrapper"
import ButtonWithFeedback from "./update-button"

interface Props {
	site: Site
}

const UpdateSiteLogoForm = ({ site }: Props) => {
	const router = useRouter()
	const [state, action] = useFormState(
		actions.updateSiteTextLogo.bind(null, site),
		null
	)

	useEffect(() => {
		if (!state) return

		if (state.success) {
			toast.success(state.message)
			router.refresh()
		} else {
			toast.error(state.message)
		}
	}, [state, router])

	return (
		<FormRoot
			className="py-8 px-8 pt-4 space-y-2 w-full rounded-xl bg-slate-900"
			// eslint-disable-next-line react/jsx-no-bind
			action={action}>
			<h3 className="text-2xl">Text Logo</h3>
			<p className="text-sm text-slate-400">Used as the Logo on your site</p>
			<Field
				name="textLogo"
				formControlProps={{
					defaultValue: site.textLogo ?? "dev-",
					placeholder: site.textLogo ?? "dev-",
				}}
				formMessageProps={{
					children: "This is the text form logo of your website.",
				}}
			/>
			<div className="flex justify-end items-center">
				<ButtonWithFeedback type="submit" variant="primary">
					Update
				</ButtonWithFeedback>
			</div>
		</FormRoot>
	)
}

export default UpdateSiteLogoForm

// <div className="py-8 px-8 pt-4 space-y-2 w-full rounded-xl bg-slate-800">
// 	<h3 className="text-2xl">Site Name</h3>
// 	<FormRoot>
// 		<Field
// 			name="name"
// 			// label="Site Name"
// 			formControlProps={{
// 				onChange: handleChange,
// 				value: site.name,
// 			}}
// 			formMessageProps={{
// 				children:
// 					"Info: This doesn't update the domain name.",
// 			}}
// 		/>
// 	</FormRoot>
// 	<Button
// 		disabled={isUpdating}
// 		onClick={() => handleSubmit()}
// 		className="self-end place-self-end">
// 	{isUpdating && <MoonLoader size={12} />} Update
// </Button>
// </div>

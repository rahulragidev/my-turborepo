"use client"

/**
 * Form Fieldset COmponent
 * A wrapper around Radix-UI form field component
 */

import * as RadixForm from "@radix-ui/react-form"

const Field = (
	props: RadixForm.FormFieldProps & {
		name: string
		type?: string
		label?: string
		formControlProps?: RadixForm.FormControlProps
		formMessageProps?: RadixForm.FormMessageProps
	}
) => {
	const {
		type = "text",
		label,
		formControlProps,
		formMessageProps,
		...otherProps
	} = props
	return (
		<RadixForm.Field className="flex flex-col" {...otherProps}>
			<RadixForm.Label className="ml-2 text-base capitalize">
				{label}
			</RadixForm.Label>
			<RadixForm.Control
				type=""
				{...formControlProps}
				className="py-2 px-2 my-2 text-lg rounded border-2 border-solid border-slate-700 font-primary"
			/>
			{formMessageProps?.children && (
				<RadixForm.Message {...formMessageProps}>
					{formMessageProps.children}
				</RadixForm.Message>
			)}
		</RadixForm.Field>
	)
}
export default Field

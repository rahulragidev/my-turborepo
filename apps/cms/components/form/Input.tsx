import clsx from "clsx"
import React, { forwardRef } from "react"

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
	label?: string
	adornment?: React.ReactNode
	containerClassname?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ containerClassname: className, label, adornment, ...inputProps },
	ref
) {
	return (
		<fieldset
			className={clsx(
				"relative bg-slate-800/10 text-slate-100 rounded text-base flex w-full border border-solid border-slate-500/25",
				className
			)}>
			{label && <label>{label}</label>}
			<input
				ref={ref}
				type="text"
				{...inputProps}
				className={clsx(
					"py-2 px-2 w-full h-full bg-transparent rounded appearance-none focus:ring-1 focus:ring-slate-200",
					inputProps.className
				)}
			/>
			{adornment && (
				<span className="flex absolute top-0 right-0 justify-center items-center px-4 h-full bg-transparent min-w-[3rem]">
					{adornment}
				</span>
			)}
		</fieldset>
	)
})

export default Input

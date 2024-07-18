import clsx from "clsx"
import { ReactNode } from "react"

const IconButton = (props: {
	children: ReactNode
	onClick: Function
	className?: string
	// variant?: "primary" | "secondary" | "tertiary"
}) => {
	const { children, onClick, className } = props

	return (
		<button
			type="button"
			onClick={() => onClick()}
			className={clsx(
				"h-8 w-8 rounded-full bg-transparent hover:bg-slate-800 flex items-center justify-center text-center transition-background duration-200 text-slate-400",
				className
			)}>
			{children}
		</button>
	)
}

export default IconButton

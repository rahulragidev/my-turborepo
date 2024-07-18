import clsx from "clsx"
import Slugify from "libs/slugify"

interface buttonProps {
	label: string
	variant?: "primary" | "secondary"
	active?: boolean
	onClick: () => void
}

const ToggleButtonGroup = ({
	buttons,
	className,
}: {
	buttons: buttonProps[]
	className?: string
}) => {
	return (
		<div
			className={clsx(
				"flex items-stretch border-2 border-solid border-slate-400 rounded-lg",
				className
			)}>
			{buttons.map(button => (
				<button
					key={`${Slugify(button.label)}`}
					type="button"
					onClick={() => button.onClick()}
					className={clsx(
						"px-2 py-2 flex-1",
						button.active
							? "bg-slate-200 text-slate-900 hover:bg-slate-300"
							: "bg-transparent text-slate-400 hover:bg-slate-500 hover:text-slate-900"
					)}>
					{button.label}
				</button>
			))}
		</div>
	)
}

export default ToggleButtonGroup

import { cn } from "lib/utils"
import { ReactNode } from "react"

const Chip = ({
	children,
	className,
}: {
	children: ReactNode | ReactNode[]
	className?: string
}) => {
	return (
		<div className={cn("rounded-full bg-slate-900 px-4 py-2", className)}>
			<p className="font-mono text-slate-400">{children}</p>
		</div>
	)
}

export default Chip

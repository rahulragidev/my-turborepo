import clsx from "clsx"
import { DragEvent, ReactNode } from "react"
import { FileDrop } from "react-file-drop"

interface FileDropComponentProps {
	children?: ReactNode | ReactNode[]
	onDrop: (_files: File[], _event: DragEvent<HTMLDivElement>) => any
	onTargetClick?: () => any
	className?: string
	noStyling?: boolean
}

const FileDropComponent = ({
	children,
	onDrop,
	onTargetClick,
	className,
	noStyling = false,
}: FileDropComponentProps) => {
	const classes = clsx(
		!noStyling &&
			"bg-black flex flex-col items-center justify-center text-center w-full h-full rounded-md",
		className
	)

	const handleDrop = (files: FileList | null, event: DragEvent<HTMLDivElement>) => {
		onDrop(files ? Array.from(files) : [], event)
	}

	return (
		<FileDrop
			draggingOverFrameClassName="border-2 border-dashed border-slate-400 rounded-lg bg-[rgba(0,0,0,0.4)]"
			onTargetClick={onTargetClick}
			targetClassName={classes}
			onDrop={handleDrop}>
			{children}
		</FileDrop>
	)
}

export default FileDropComponent

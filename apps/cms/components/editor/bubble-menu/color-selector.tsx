import * as Popover from "@radix-ui/react-popover"
import { Editor } from "@tiptap/core"
import { Check, ChevronDown } from "lucide-react"
import { Dispatch, FC, SetStateAction } from "react"

export interface BubbleColorMenuItem {
	name: string
	color: string
}

interface ColorSelectorProps {
	editor: Editor
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
	{
		name: "Default",
		color: "var(--black)",
	},
	{
		name: "Purple",
		color: "#9333EA",
	},
	{
		name: "Red",
		color: "#E00000",
	},
	{
		name: "Yellow",
		color: "#EAB308",
	},
	{
		name: "Blue",
		color: "#2563EB",
	},
	{
		name: "Green",
		color: "#008A00",
	},
	{
		name: "Orange",
		color: "#FFA500",
	},
	{
		name: "Pink",
		color: "#BA4081",
	},
	{
		name: "Gray",
		color: "#A8A29E",
	},
]

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
	{
		name: "Default",
		color: "var(--highlight-default)",
	},
	{
		name: "Purple",
		color: "var(--highlight-purple)",
	},
	{
		name: "Red",
		color: "var(--highlight-red)",
	},
	{
		name: "Yellow",
		color: "var(--highlight-yellow)",
	},
	{
		name: "Blue",
		color: "var(--highlight-blue)",
	},
	{
		name: "Green",
		color: "var(--highlight-green)",
	},
	{
		name: "Orange",
		color: "var(--highlight-orange)",
	},
	{
		name: "Pink",
		color: "var(--highlight-pink)",
	},
	{
		name: "Gray",
		color: "var(--highlight-gray)",
	},
]

export const ColorSelector: FC<ColorSelectorProps> = ({ editor, isOpen, setIsOpen }) => {
	const activeColorItem = TEXT_COLORS.find(({ color }) =>
		editor.isActive("textStyle", { color })
	)

	const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
		editor.isActive("highlight", { color })
	)

	return (
		<Popover.Root open={isOpen}>
			<div className="relative h-full">
				<Popover.Trigger
					className="flex items-stretch w-full text-sm font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200"
					onClick={() => setIsOpen(!isOpen)}>
					<span
						style={{
							color: activeColorItem?.color,
							backgroundColor: activeHighlightItem?.color,
						}}>
						A
					</span>

					<ChevronDown className="h-4 w-4" />
				</Popover.Trigger>

				<Popover.Content
					align="start"
					className="z-[99999] my-1 ax-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-slate-200 bg-slate-900 p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
					<div className="my-1 px-2 text-sm text-slate-400">Color</div>
					{TEXT_COLORS.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => {
								editor.commands.unsetColor()
								if (name !== "Default") {
									editor
										.chain()
										.focus()
										.setColor(color || "")
										.run()
								}
								setIsOpen(false)
							}}
							className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
							type="button">
							<div className="flex items-center space-x-2">
								<div
									className="rounded-sm border border-slate-200 px-1 py-px font-medium"
									style={{ color }}>
									A
								</div>
								<span>{name}</span>
							</div>
							{editor.isActive("textStyle", { color }) && (
								<Check className="h-4 w-4" />
							)}
						</button>
					))}

					<div className="mb-1 mt-2 px-2 text-sm text-slate-500">
						Background
					</div>

					{HIGHLIGHT_COLORS.map(({ name, color }) => (
						<button
							key={name}
							onClick={() => {
								editor.commands.unsetHighlight()
								if (name !== "Default") {
									editor.commands.setHighlight({ color })
								}
								setIsOpen(false)
							}}
							className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
							type="button">
							<div className="flex items-center space-x-2">
								<div
									className="rounded-sm border border-slate-200 px-1 py-px font-medium"
									style={{ backgroundColor: color }}>
									A
								</div>
								<span>{name}</span>
							</div>
							{editor.isActive("highlight", { color }) && (
								<Check className="h-4 w-4" />
							)}
						</button>
					))}
				</Popover.Content>
			</div>
		</Popover.Root>
	)
}

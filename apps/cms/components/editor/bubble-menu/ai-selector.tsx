import { Editor } from "@tiptap/core"
import { useCompletion } from "ai/react"
import { getSelectedText } from "lib/editor"
import { Sparkle, Wand } from "lucide-react"
import { Dispatch, FC, SetStateAction, useContext, useEffect, useRef } from "react"
import NovelContext from "../provider"

interface AISelectorProps {
	editor: Editor
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AISelector: FC<AISelectorProps> = ({ editor, isOpen, setIsOpen }) => {
	const inputRef = useRef<HTMLInputElement>(null)

	// Autofocus on input by default
	useEffect(() => {
		inputRef?.current?.focus()
	})

	const { completionApi } = useContext(NovelContext)

	const { complete, completion } = useCompletion({
		id: "novel/ai-selector",
		api: completionApi,
		onError: err => {
			console.error("error at useComponetn in AISelector", err)
			// toast.error(err.message)
		},
	})

	const prev = useRef("")

	// Insert chunks of the generated text
	useEffect(() => {
		const diff = completion.slice(prev.current.length)
		prev.current = completion
		editor?.commands.insertContent(diff)
	}, [editor, completion])

	return (
		<div className="relative">
			<button
				type="button"
				className="flex whitespace-nowrap h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700 active:bg-slate-200"
				onClick={() => {
					setIsOpen(!isOpen)
				}}>
				<Sparkle className="h-3.5 w-auto" />
				<p>Ask AI</p>
			</button>
			{isOpen && (
				<form
					onSubmit={e => {
						e.preventDefault()
						const input = e.currentTarget[0] as HTMLInputElement
						const text = getSelectedText(editor)
						complete(text, {
							body: {
								systemPrompt: `You are an AI writing assistant that edits the following text.\n${input.value}`,
							},
						})
						setIsOpen(false)
					}}
					className="fixed top-full -overflow-hidden rounded border border-slate-200 bg-slate-950 p-1 imate-in fade-in">
					<input
						ref={inputRef}
						type="text"
						placeholder="Ask AI"
						className="ite p-1 text-sm outline-none"
					/>
					<button
						type="button"
						onClick={() => {
							setIsOpen(false)
						}}
						className="flex center rounded-sm p-1 text-slate-600 transition-all hover:">
						<Wand className="h-4 w-4" />
						<label>Done</label>
					</button>
				</form>
			)}
		</div>
	)
}

export default AISelector

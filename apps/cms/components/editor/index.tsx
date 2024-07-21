"use client"

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { Editor as EditorClass, Extensions } from "@tiptap/core"
import TiptapLink from "@tiptap/extension-link"
import { EditorProps } from "@tiptap/pm/view"
import { EditorContent, JSONContent, useEditor } from "@tiptap/react"
import va from "@vercel/analytics"
import { useCompletion } from "ai/react"
import { getPrevText } from "lib/editor"
import useLocalStorage from "lib/hooks/use-local-storage"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { useDebouncedCallback } from "use-debounce"
import EditorBubbleMenu from "./bubble-menu"
import defaultEditorContent from "./default-content"
import defaultExtensions from "./extensions"
import ImageResizer from "./extensions/image-resizer"
// import { setImageUploadToken } from "./plugins/upload-images"
import { cn } from "lib/utils"
import defaultEditorProps from "./props"
import NovelContext from "./provider"

interface EditorComponentProps {
	/**
	 * The API route to use for the OpenAI completion API.
	 * Defaults to "/api/generate".
	 */
	completionApi?: string
	/**
	 * Additional classes to add to the editor container.
	 * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-slate-200 bg-slate-950 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg".
	 */
	className?: string
	/**
	 * The default value to use for the editor.
	 * Defaults to defaultEditorContent.
	 */
	defaultValue?: JSONContent | string
	/**
	 * A list of extensions to use for the editor, in addition to the default Novel extensions.
	 * Defaults to [].
	 */
	extensions?: Extensions
	/**
	 * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
	 * Defaults to {}.
	 */
	editorProps?: EditorProps
	/**
	 * A callback function that is called whenever the editor is updated.
	 * Defaults to () => {}.
	 */
	// eslint-disable-next-line no-unused-vars
	onUpdate?: (editor?: EditorClass) => void | Promise<void>
	/**
	 * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
	 * Defaults to () => {}.
	 */
	// eslint-disable-next-line no-unused-vars
	onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>
	/**
	 * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
	 * Defaults to 750.
	 */
	debounceDuration?: number
	/**
	 * The key to use for storing the editor's value in local storage.
	 * Defaults to "novel__content".
	 */
	storageKey?: string
	/**
	 * Disable local storage read/save.
	 * Defaults to false.
	 */
	disableLocalStorage?: boolean
	/**
	 * Lokus user's token
	 */
	// token: string
}

const Editor = ({
	completionApi = "/api/generate",
	className = "",
	defaultValue = defaultEditorContent,
	extensions = [],
	editorProps = {},
	onUpdate = () => {},
	onDebouncedUpdate = () => {},
	debounceDuration = 750,
	storageKey = "novel__content",
	disableLocalStorage = false,
	// token,
}: EditorComponentProps) => {
	// useEffect(() => {
	//	if (token) setImageUploadToken(token)
	// }, [token])

	const prev = useRef("")

	const [content, setContent] = useLocalStorage(storageKey, defaultValue)
	const [hydrated, setHydrated] = useState(false)

	const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
		const json = editor.getJSON()
		console.log("editor json", json)
		onDebouncedUpdate(editor)

		if (!disableLocalStorage) {
			setContent(json)
		}
	}, debounceDuration)

	const editor = useEditor({
		extensions: [
			...defaultExtensions,
			...extensions,
			TiptapLink.extend({
				exitable: true,
			}),
			TiptapLink.configure({
				HTMLAttributes: {
					class: "text-slate-400 underline underline-offset-[3px] hover:text-slate-600 transition-colors cursor-pointer",
				},
			}),
		],
		editorProps: {
			...defaultEditorProps,
			...editorProps,
		},
		onUpdate: e => {
			const { selection } = e.editor.state
			const lastTwo = getPrevText(e.editor, {
				chars: 2,
			})
			if (lastTwo === "++" && !isLoading) {
				e.editor.commands.deleteRange({
					from: selection.from - 2,
					to: selection.from,
				})
				complete(
					getPrevText(e.editor, {
						chars: 5000,
					})
				)
				// complete(e.editor.storage.markdown.getMarkdown());
				va.track("Autocomplete Shortcut Used")
			} else {
				onUpdate(e.editor)
				debouncedUpdates(e)
			}
		},
		autofocus: "end",
	})

	const { complete, completion, isLoading, stop } = useCompletion({
		id: "novel",
		api: completionApi,
		onFinish: (_prompt, completion) => {
			editor?.commands.setTextSelection({
				from: editor.state.selection.from - completion.length,
				to: editor.state.selection.from,
			})
		},
		onError: err => {
			toast.error(err.message)
			if (err.message === "You have reached your request limit for the day.") {
				va.track("Rate Limit Reached")
			}
		},
	})

	/** ---------
	 * UseEffect Stuff
	 * ---------
	 */

	// Insert chunks of the generated text
	useEffect(() => {
		const diff = completion.slice(prev.current.length)
		prev.current = completion
		editor?.commands.insertContent(diff)
	}, [isLoading, editor, completion])

	useEffect(() => {
		// if user presses escape or cmd + z and it's loading,
		// stop the request, delete the completion, and insert back the "++"
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
				stop()
				if (e.key === "Escape") {
					editor?.commands.deleteRange({
						from: editor.state.selection.from - completion.length,
						to: editor.state.selection.from,
					})
				}
				editor?.commands.insertContent("++")
			}
		}
		const mousedownHandler = (e: MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			stop()
			// eslint-disable-next-line no-alert
			if (window.confirm("AI writing paused. Continue?")) {
				complete(editor?.getText() || "")
			}
		}
		if (isLoading) {
			document.addEventListener("keydown", onKeyDown)
			window.addEventListener("mousedown", mousedownHandler)
		} else {
			document.removeEventListener("keydown", onKeyDown)
			window.removeEventListener("mousedown", mousedownHandler)
		}
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			window.removeEventListener("mousedown", mousedownHandler)
		}
	}, [stop, isLoading, editor, complete, completion.length])

	// Default: Hydrate the editor with the content from localStorage.
	// If disableLocalStorage is true, hydrate the editor with the defaultValue.
	useEffect(() => {
		if (!editor || hydrated) return

		const value = disableLocalStorage ? defaultValue : content

		if (value) {
			console.log("type of value being set", typeof value)
			editor.commands.setContent(value)
			setHydrated(true)
		}
	}, [editor, defaultValue, content, hydrated, disableLocalStorage])

	return (
		<NovelContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				completionApi,
			}}>
			<div
				className="max-w-screen relative"
				onClick={() => {
					editor?.chain().focus().run()
				}}>
				{editor && <EditorBubbleMenu editor={editor} />}
				{editor?.isActive("image") && <ImageResizer editor={editor} />}
				<EditorContent
					editor={editor}
					className={cn(
						"w-full max-w-5xl mx-auto min-h-[70vh] pt-8 pb-24 px-4 sm:px-12",
						className
					)}
				/>
			</div>
		</NovelContext.Provider>
	)
}

export default Editor

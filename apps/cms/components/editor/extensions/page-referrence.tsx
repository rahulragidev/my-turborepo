import { Editor, Extension, Range } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import { GET_ROOT_PAGE_QUERY } from "dataHooks/useRootPage"
import { GraphQLResponse } from "graphql-request/build/esm/types"
import fetchWithToken from "libs/fetchers/fetchWithToken"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import tippy from "tippy.js"
import { PageResponse } from "types/generated/types"
// import insertFeaturedBlogs from "./insert-featured-blogs"

interface PageItem {
	name: string
	slug?: string
	description?: string
	searchTerms?: string[]
	isPublic: boolean
}

export interface SlashCommandProps {
	editor: Editor
	range: Range
}

// Page extension
const Page = Extension.create({
	name: "page-reference",
	addOptions() {
		return {
			suggestion: {
				char: "[[",
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor
					range: Range
					props: any
				}) => {
					props.command({ editor, range })
				},
			},
		}
	},
	addProseMirrorPlugins() {
		return [
			Suggestion({
				pluginKey: new PluginKey("page-reference-suggestions-plugin"),
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})

// List of available commands
const getPages = async ({ query, editor }: { query: string; editor: Editor }) => {
	// console.groupCollapsed("getPages")
	// console.log("query", query)
	// console.log("editor", editor)
	// console.groupEnd()

	const siteId =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.siteId as string)
			: ""

	const token =
		typeof editor.options?.editorProps?.attributes === "object"
			? (editor.options.editorProps.attributes.token as string)
			: ""

	// const parentId =
	//	typeof editor.options?.editorProps?.attributes === "object"
	//		? (editor.options.editorProps.attributes.pageId as string)
	//		: ""

	const rootPage = await fetchWithToken<GraphQLResponse<PageResponse>>({
		query: GET_ROOT_PAGE_QUERY,
		variables: {
			siteId, // this is available as a params.siteId or editor.options.attrs.siteId.
		},
		token,
	})

	console.log("rootPage response from getPages", rootPage)

	return rootPage?.data?.data?.children?.filter(item => {
		if (typeof query === "string" && query.length > 0) {
			const search = query.toLowerCase()
			return item.name.toLowerCase().includes(search)
		}
		return true
	})
}

// utility to update the scroll position of the dropdown
export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
	const containerHeight = container.offsetHeight
	const itemHeight = item ? item.offsetHeight : 0

	const top = item.offsetTop
	const bottom = top + itemHeight

	if (top < container.scrollTop) {
		container.scrollTop -= container.scrollTop - top + 5
	} else if (bottom > containerHeight + container.scrollTop) {
		container.scrollTop += bottom - containerHeight - container.scrollTop + 5
	}
}

// PagesList react component. This is the component that gets rendered in the dropdown
const PagesList = ({
	items,
	editor,
	range,
}: {
	items: PageItem[]
	editor: Editor
	range: Range
}) => {
	const pageListContainer = useRef<HTMLDivElement>(null)
	const [selectedItem, setSelectedItem] = useState<PageItem | null>(null)
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
	const pathname = usePathname()

	const insertPage = useCallback(
		({ item, embedType }: { item: PageItem; embedType: "inline" | "button" }) => {
			switch (embedType) {
				case "inline":
					editor
						.chain()
						.deleteRange(range)
						.addPageLink({
							href: item.slug!,
							name: `${item.name}`,
							isPublic: item.isPublic,
						})
						.focus(range.from + item.name.length + 3)
						.run()
					//.chain()
					//.deleteRange(range)
					//.focus()
					//.insertContentAt(range.from, {
					//	type: "text",
					//	text: item.name,
					//})
					//.setTextSelection({
					//	from: range.from,
					//	to: range.from + item.name.length,
					//})
					//.setLink({
					//	href: `https://${pathname}/${item.slug}`,
					//	class: "px-2 py-1 rounded-lg bg-blue-100 text-blue-500 no-underline hover:bg-blue-200 transform-all",
					//})
					//.focus(range.from + item.name.length + 1)
					//.run()
					break
				case "button":
					//alert(`Button name:${item.name} slug:${item.slug}`)
					editor
						.chain()
						.deleteRange(range)
						.focus()
						.insertContent({
							type: "button",
							attrs: {
								href: `/${item.slug}`,
								text: `${item.name}`,
							},
						})
						.enter()
						.focus("end")
						.run()
					break

				default:
					break
			}
		},
		[editor]
	)

	useEffect(() => {
		const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"]
		// eslint-disable-next-line consistent-return
		const onKeyDown = (e: KeyboardEvent) => {
			if (navigationKeys.includes(e.key)) {
				const currentIndex = selectedIndex ?? 0
				e.preventDefault()
				if (e.key === "ArrowUp") {
					setSelectedIndex((currentIndex + items.length - 1) % items.length)
					return true
				}
				if (e.key === "ArrowDown") {
					setSelectedIndex((currentIndex + 1) % items.length)
					return true
				}
				if (e.key === "Enter") {
					e.preventDefault()
					e.stopPropagation()
					setSelectedItem(items[currentIndex])
					return true
				}
				return false
			}
		}
		document.addEventListener("keydown", onKeyDown)
		return () => {
			document.removeEventListener("keydown", onKeyDown)
		}
	}, [items, selectedIndex, setSelectedIndex])

	useLayoutEffect(() => {
		const container = pageListContainer?.current

		const item = container?.children[0] as HTMLElement

		if (item && container) updateScrollView(container, item)
	}, [selectedIndex])

	if (items.length > 0) {
		if (!selectedItem) {
			return (
				<div
					id="pages-list"
					ref={pageListContainer}
					className="z-50 h-auto max-h-[30rem] w-72 overflow-y-auto scroll-smooth rounded-lg border border-slate-800 bg-slate-950 backdrop-blur-sm shadow-md transition-all">
					{items.map((item: PageItem, index: number) => (
						<button
							type="button"
							className={`flex w-full items-center space-x-2 px-2 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 ${
								index === selectedIndex
									? "bg-slate-800 text-slate-200"
									: ""
							}`}
							key={item.slug || item.name}
							onClick={() => setSelectedItem(item)}>
							<div>
								<p className="font-semibold">{item.name}</p>
								<pre>{item.slug}</pre>
								{item.description && (
									<p className="text-xs text-slate-500">
										{item.description}
									</p>
								)}
							</div>
						</button>
					))}
				</div>
			)
		}
		return (
			<div
				id="pages-list"
				ref={pageListContainer}
				className="z-50 h-auto max-h-[30rem] w-72 overflow-y-auto scroll-smooth rounded-lg border border-slate-800 bg-slate-950 backdrop-blur-sm shadow-md transition-all">
				<div className="py-4 px-2">
					<p>How do you want to embed?</p>
					<p className="text-base text-slate-400">{selectedItem?.name}</p>
				</div>
				<button
					type="button"
					className="w-full text-left px-2 py-2 text-sm text-slate-200 hover:bg-slate-800"
					onClick={() =>
						insertPage({ item: selectedItem!, embedType: "inline" })
					}>
					Inline
				</button>
				<button
					type="button"
					className="w-full text-left px-2 py-2 text-sm text-slate-200 hover:bg-slate-800"
					onClick={() =>
						insertPage({ item: selectedItem!, embedType: "button" })
					}>
					Button
				</button>
			</div>
		)
	}
	return null
}

const renderPages = () => {
	let component: ReactRenderer | null = null
	let popup: any | null = null

	return {
		onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
			component = new ReactRenderer(PagesList, {
				props,
				editor: props.editor,
			})

			// @ts-ignore
			popup = tippy("body", {
				getReferenceClientRect: props.clientRect,
				appendTo: () => document.body,
				content: component.element,
				showOnCreate: true,
				interactive: true,
				trigger: "manual",
				placement: "bottom-start",
			})
		},
		onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
			component?.updateProps(props)

			popup[0]?.setProps({
				getReferenceClientRect: props.clientRect,
			})
		},
		onKeyDown: (props: { event: KeyboardEvent }) => {
			if (props.event.key === "Escape") {
				popup?.[0].hide()

				return true
			}
			if (props.event.key === "Enter") {
				props.event.preventDefault()
				return true
			}
			// @ts-ignore
			return component?.ref?.onKeyDown(props)
		},
		onExit: () => {
			popup?.[0].destroy()
			component?.destroy()
		},
	}
}

const PageReference = Page.configure({
	suggestion: {
		items: getPages,
		render: renderPages,
	},
})

export default PageReference

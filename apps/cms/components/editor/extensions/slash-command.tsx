import { getPrevText } from "lib/editor"

import { Editor, Extension, Range } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import { ReactRenderer } from "@tiptap/react"
import Suggestion from "@tiptap/suggestion"
import va from "@vercel/analytics"
import { useCompletion } from "ai/react"
import useFeaturedPages from "dataHooks/useFeaturedPages"
import {
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Link,
    List,
    ListOrdered,
    Loader,
    Sparkles,
    Text,
    TextQuote,
    Youtube
} from "lucide-react"
import { useParams } from "next/navigation"
import {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react"
import { toast } from "react-hot-toast"
import tippy from "tippy.js"
import showSubpagesDialog from "../dialogs/show-subpages-dialog"
import showYoutubeDialog from "../dialogs/show-youtube-dialog"
import showButtonDialog from "../dialogs/showAddButtonDialogComponent"
import { startImageUpload } from "../plugins/upload-images"
import NovelContext from "../provider"
// import insertFeaturedBlogs from "./insert-featured-blogs"

interface CommandItemProps {
    category: "text" | "media" | "blocks" | "ai" | "other"
    sId?: number
    title: string
    description: string
    searchTerms?: string[]
    icon: ReactNode
    command?: ({
        // eslint-disable-next-line no-unused-vars
        editor,
        // eslint-disable-next-line no-unused-vars
        range,
        // eslint-disable-next-line no-unused-vars
        data
    }: {
        editor: Editor
        range: Range
        data: any
    }) => void
}

export interface SlashCommandProps {
    editor: Editor
    range: Range
}

interface SortedItem {
    category: string
    items: CommandItemProps[]
}

// Command extension
const Command = Extension.create({
    name: "slash-command",
    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({
                    editor,
                    range,
                    props
                }: {
                    editor: Editor
                    range: Range
                    props: any
                }) => {
                    props.command({ editor, range })
                }
            }
        }
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                pluginKey: new PluginKey("slash-command-suggestions-plugin"),
                editor: this.editor,
                ...this.options.suggestion
            })
        ]
    }
})

// List of available commands
const getSuggestionItems = ({ query }: { query: string }) => {
    const items: CommandItemProps[] = [
        {
            category: "ai",
            title: "Continue writing",
            description: "Use AI to expand your thoughts.",
            searchTerms: ["gpt"],
            icon: <Sparkles className="w-7 text-slate-200" />
        },
        {
            category: "text",
            title: "Text",
            description: "Just start typing with plain text.",
            searchTerms: ["p", "paragraph"],
            icon: <Text size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .run()
            }
        },
        {
            category: "text",
            title: "Heading 1",
            description: "Big section heading.",
            searchTerms: ["title", "big", "large"],
            icon: <Heading1 size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run()
            }
        },
        {
            category: "text",
            title: "Heading 2",
            description: "Medium section heading.",
            searchTerms: ["subtitle", "medium"],
            icon: <Heading2 size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run()
            }
        },
        {
            category: "text",
            title: "Heading 3",
            description: "Small section heading.",
            searchTerms: ["subtitle", "small"],
            icon: <Heading3 size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run()
            }
        },
        {
            category: "text",
            title: "Bullet List",
            description: "Create a simple bullet list.",
            searchTerms: ["unordered", "point"],
            icon: <List size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBulletList()
                    .run()
            }
        },
        {
            category: "text",
            title: "Numbered List",
            description: "Create a list with numbering.",
            searchTerms: ["ordered"],
            icon: <ListOrdered size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleOrderedList()
                    .run()
            }
        },
        {
            category: "text",
            title: "Quote",
            description: "Capture a quote.",
            searchTerms: ["blockquote"],
            icon: <TextQuote size={18} />,
            command: ({ editor, range }: SlashCommandProps) =>
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode("paragraph", "paragraph")
                    .toggleBlockquote()
                    .run()
        },
        {
            category: "text",
            title: "Code",
            description: "Capture a code snippet.",
            searchTerms: ["codeblock"],
            icon: <Code size={18} />,
            command: ({ editor, range }: SlashCommandProps) =>
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleCodeBlock()
                    .run()
        },
        {
            category: "media",
            title: "YouTube",
            description: "Embed a YouTube video",
            searchTerms: ["youtube", "video", "embed"],
            icon: <Youtube size={16} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor.chain().focus().deleteRange(range).run()
                showYoutubeDialog(editor)
            }
        },
        {
            category: "media",
            title: "Image",
            description: "Upload an image from your computer.",
            searchTerms: ["photo", "picture", "media"],
            icon: <ImageIcon size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                editor.chain().focus().deleteRange(range).run()
                // upload image
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = async () => {
                    if (input.files?.length) {
                        const file = input.files[0]
                        const pos = editor.view.state.selection.from
                        startImageUpload(
                            file,
                            editor.view,
                            pos,
                            // @ts-expect-error custom type hasn't been added yet for editorProps
                            editor.options?.editorProps?.attributes?.token ||
                                undefined
                        )
                    }
                }
                input.click()
            }
        },
        {
            category: "blocks",
            title: "Button",
            description: "Add a Button to link to another page",
            searchTerms: ["button", "link"],
            icon: <Link size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                // delete the range
                editor.chain().focus().deleteRange(range).run()
                // show the dialog to pick the button
                showButtonDialog(editor, range)
            }
        },
        {
            category: "blocks",
            title: "Sub Page",
            description: "Create a sub page within this page",
            searchTerms: ["subpage", "sub page", "page"],
            icon: <Text size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                // delete the content in the range
                editor.chain().focus().deleteRange(range).run()
                // show the dialog to pick the page
                showSubpagesDialog(editor, range)
            }
        },
        {
            category: "blocks",
            title: "Featured Blogs",
            description: "Add list of your featured blogs",
            searchTerms: ["featured", "section", "popular"],
            icon: <Text size={18} />,
            command: ({ editor, range }: SlashCommandProps) => {
                console.log("insert featured-blogs at", range)
                editor.chain().focus().deleteRange(range).run()
                editor.commands.setFeaturedPages({ layout: "list" })
            }
        }

        // {
        //	title: "Send Feedback",
        //	description: "Let us know how we can improve.",
        //	icon: <MessageSquarePlus size={18} />,
        //	command: ({ editor, range }: SlashCommandProps) => {
        //		editor.chain().focus().deleteRange(range).run()
        //		window.open("/feedback", "_blank")
        //	},
        // },
    ]
    return items.filter(item => {
        if (typeof query === "string" && query.length > 0) {
            const search = query.toLowerCase()
            return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                (item.searchTerms &&
                    item.searchTerms.some((term: string) =>
                        term.includes(search)
                    ))
            )
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
        container.scrollTop +=
            bottom - containerHeight - container.scrollTop + 5
    }
}
// CommandList react component. This is the component that gets rendered in the dropdown
const CommandList = ({
    items,
    command,
    editor,
    range
}: {
    items: CommandItemProps[]
    command: any
    editor: any
    range: any
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const { completionApi } = useContext(NovelContext)

    const { complete, isLoading } = useCompletion({
        id: "novel",
        api: completionApi,
        onResponse: response => {
            if (response.status === 429) {
                toast.error("You have reached your request limit for the day.")
                va.track("Rate Limit Reached")
                return
            }
            editor.chain().focus().deleteRange(range).run()
        },
        onFinish: (_prompt, completion) => {
            // highlight the generated text
            editor.commands.setTextSelection({
                from: range.from,
                to: range.from + completion.length
            })
        },
        onError: e => {
            toast.error(e.message)
        }
    })

    // get siteId from the URL
    const params = useParams<{ siteId: string }>()
    // fetch featured blogs
    const { data: featuredBlogs } = useFeaturedPages(params?.siteId || "")

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index]
            va.track("Slash Command Used", {
                command: item!.title
            })
            if (item) {
                if (item.title === "Continue writing") {
                    const toastId = toast.loading("Generating text...")
                    if (isLoading) {
                        return
                    }
                    complete(
                        getPrevText(editor, {
                            chars: 5000,
                            offset: 1
                        })
                    )
                        .then(() => {
                            toast.dismiss(toastId)
                            toast.success("Text generated.")
                        })
                        .catch(() => {
                            toast.dismiss(toastId)
                            toast.error("Failed to generate text.")
                        })
                }
                // else if (item.title === "Featured Blogs") {
                //	// fetchFeaturedBlogs()
                //	editor.chain().focus().deleteRange(range).run()
                //	if (
                //		featuredBlogs?.data?.data &&
                //		featuredBlogs?.data?.data.length > 0
                //	) {
                //		const content = featuredBlogs?.data?.data?.map(blog => ({
                //			type: "page-node",
                //			attrs: {
                //				name: blog.name,
                //				slug: blog.slug,
                //			},
                //		}))

                //		// Insert a Heading
                //		editor.commands.insertContent({
                //			type: "heading",
                //			attrs: { level: 2 },
                //			content: [{ type: "text", text: "Featured Blogs" }],
                //		})

                //		editor.commands.insertContent({
                //			type: "paragraph",
                //			content: [
                //				{
                //					type: "text",
                //					text: "Paragraph description for blogs go here...",
                //					marks: [
                //						{
                //							type: "italic",
                //							HTMLAttributes: {
                //								class: "text-slate-300",
                //							},
                //						},
                //					],
                //				},
                //			],
                //		})
                //		// Debug
                //		console.log(
                //			`featuredBlogs ${featuredBlogs?.data?.data?.length}`,
                //			featuredBlogs?.data?.data
                //		)
                //		editor.commands.insertContent(content)

                //		return
                //	}
                //	editor.commands.insertPlaceholder({
                //		text: "You don't have any featured blogs yet.",
                //	})
                // }
                else {
                    command(item)
                }
            }
        },
        [items, isLoading, complete, editor, featuredBlogs?.data?.data, command]
    )

    useEffect(() => {
        const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"]
        // eslint-disable-next-line consistent-return
        const onKeyDown = (e: KeyboardEvent) => {
            if (navigationKeys.includes(e.key)) {
                e.preventDefault()
                if (e.key === "ArrowUp") {
                    setSelectedIndex(
                        (selectedIndex + items.length - 1) % items.length
                    )
                    return true
                }
                if (e.key === "ArrowDown") {
                    setSelectedIndex((selectedIndex + 1) % items.length)
                    return true
                }
                if (e.key === "Enter") {
                    selectItem(selectedIndex)
                    return true
                }
                return false
            }
        }
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [items, selectedIndex, setSelectedIndex, selectItem])

    useEffect(() => {
        setSelectedIndex(0)
    }, [items])

    const commandListContainer = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const container = commandListContainer?.current

        const item = container?.children[selectedIndex] as HTMLElement

        if (item && container) updateScrollView(container, item)
    }, [selectedIndex])

    const groupedItems = items.reduce(
        (acc, item) => {
            const { category } = item
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category]!.push(item)
            return acc
        },
        {} as Record<string, CommandItemProps[]>
    )

    // this is needed for the ID for each item in the list across different categories
    let sId = 0
    const sortedItems: SortedItem[] = Object.entries(groupedItems).map(
        ([category, items]) => {
            // eslint-disable-next-line no-plusplus
            const itemsWithSId = items.map(item => ({ ...item, sId: sId++ }))
            return { category, items: itemsWithSId }
        }
    )

    console.log("sortedItems", sortedItems)

    return sortedItems.length > 0 ? (
        <div
            id="slash-command"
            ref={commandListContainer}
            className="z-50 h-auto max-h-[30rem] w-72 overflow-y-auto scroll-smooth rounded-lg border border-slate-800 bg-slate-950 backdrop-blur-sm shadow-md transition-all">
            {sortedItems.map((item: SortedItem, _index: number) => {
                return (
                    <>
                        <h3 className="font-primary font-medium text-sm ml-3 uppercase tracking-wide mt-4 mb-2">
                            {item.category}
                        </h3>
                        {item.items.map((commandItem: CommandItemProps) => (
                            <button
                                type="button"
                                className={`flex w-full items-center space-x-2 px-2 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 border-b border-solid border-slate-900 ${
                                    commandItem.sId === selectedIndex
                                        ? "bg-slate-800 text-slate-200"
                                        : ""
                                }`}
                                key={`${commandItem.title}`}
                                onClick={() => selectItem(commandItem.sId!)}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                                    {commandItem.title === "Continue writing" &&
                                    isLoading ? (
                                        <Loader className="animate-spin" />
                                    ) : (
                                        commandItem.icon
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        {commandItem.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {commandItem.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </>
                )
            })}
        </div>
    ) : null
}

const renderItems = () => {
    let component: ReactRenderer | null = null
    let popup: any | null = null

    return {
        onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor
            })

            // @ts-ignore
            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start"
            })
        },
        onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
            component?.updateProps(props)

            popup[0]?.setProps({
                getReferenceClientRect: props.clientRect
            })
        },
        onKeyDown: (props: { event: KeyboardEvent }) => {
            if (props.event.key === "Escape") {
                popup?.[0].hide()

                return true
            }

            // @ts-ignore
            return component?.ref?.onKeyDown(props)
        },
        onExit: () => {
            popup?.[0].destroy()
            component?.destroy()
        }
    }
}

const SlashCommand = Command.configure({
    suggestion: {
        items: getSuggestionItems,
        render: renderItems
    }
})

export default SlashCommand

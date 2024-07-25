/**
 * This is the dropdown component that shows the list of commands when the user types a slash (/) in the editor.
 * It also handles the keyboard events for the commands list.
 * @param items The list of commands to show in the dropdown
 * @param command The function to call when a command is selected
 * @param editor The editor instance
 * @param range The range of the slash command
 * @param render The render prop
 * @returns The commands list component
 * @category Components
 * @module CommandDropdownList
 * @see CommandDropdown
 * @see CommandDropdownItem
 *
 * Context for future reference:
 * This component receives the editor instance, the range of the slash command, along with the list of commands to show in the dropdown.
 * We can use the editor, range, passed as props to this component to call the editor commands and perform necessary mutations.
 * We don't need to call the editor commands from the parent component (getSuggestonItems.tsx)
 * Infact, getSuggestion items can be updated to not have the command function at all.
 *
 *
 */

import { Editor, Range } from "@tiptap/react"
import { useCompletion } from "ai/react"
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react"
import { Loader } from "react-feather"
import { toast } from "react-hot-toast"
// import UploadFile from "libs/uploadFile"
import AllPagesList from "components/AllPagesList"
import Button from "components/Button"
import CustomDialogBox from "components/layouts/CustomDialogBox"
import useToken from "dataHooks/useToken"
import UploadFile from "libs/uploadFile"
import { Page } from "types/generated/types"
import { SlashCommandItem } from "./getSuggestionItems_Deprecated"

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

interface CommandsListProps {
    items: SlashCommandItem[]
    command: (_item: any) => void
    editor: Editor
    range: Range
    // eslint-disable-next-line react/no-unused-prop-types
    render?: {
        popup: any[]
    }
}

interface CommandsListRef {
    // eslint-disable-next-line no-unused-vars
    onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean
}

interface SortedItem {
    category: string
    items: SlashCommandItem[]
}

const CommandDropdownList = forwardRef<CommandsListRef, CommandsListProps>(
    (props, ref) => {
        const { items, command, editor, range } = props
        const { data: token } = useToken()
        const [selectedIndex, setSelectedIndex] = useState(0)
        const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false)
        const [pageModalOpen, setPageModelOpen] = useState(false)
        const [youtubeLink, setYoutubeLink] = useState<string | null>(null)

        const groupedItems = items.reduce(
            (acc, item) => {
                const { category } = item
                if (!acc[category]) {
                    acc[category] = []
                }
                acc[category]!.push(item)
                return acc
            },
            {} as Record<string, SlashCommandItem[]>
        )

        const sortedItems: SortedItem[] = Object.entries(groupedItems).map(
            ([category, items]) => ({
                category,
                items
            })
        )

        const { complete, completion, isLoading, stop, setCompletion } =
            useCompletion({
                id: "lokus",
                api: "/api/generate",
                onResponse: response => {
                    if (response.status === 429) {
                        toast.error(
                            "You have reached your request limit for the day."
                        )
                        // va.track("Rate Limit Reached")
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
                    stop()
                    setCompletion("")
                },
                onError: () => {
                    toast.error("Something went wrong.")
                }
            })

        const selectItem = useCallback(
            (index: number) => {
                const item = items[index]
                if (item) {
                    if (item.title === "Continue writing") {
                        // we're using this for now until we can figure out a way to stream markdown text with proper formatting
                        complete(editor.getText()) // Call the completion API
                        // complete(editor.storage.markdown.getMarkdown());
                        // command(item)
                    }
                    // for Image
                    if (item.title === "Image") {
                        // trigger file input here.
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.style.display = "none"
                        input.click()
                        input.onchange = async e => {
                            const file = (e.target as HTMLInputElement)
                                .files?.[0]
                            if (file && token) {
                                if (file.type === "image/svg+xml") {
                                    toast.error(
                                        "Sorry! SVGs are not supported here."
                                    )
                                    return
                                }
                                // TODO: Compress file here?
                                // upload file here
                                toast.promise(
                                    UploadFile(file, token as string),
                                    {
                                        error: err => {
                                            return (
                                                err.message ||
                                                err ||
                                                "Something went wrong"
                                            )
                                        },
                                        success: res => {
                                            if (res.success) {
                                                // add image here,
                                                editor?.commands.insertContent({
                                                    type: "image",
                                                    attrs: {
                                                        src: res?.data
                                                            ?.variants?.[0] as string,
                                                        assetId: res?.data
                                                            ?._id as string,
                                                        blurDataURL: res?.data
                                                            ?.blurhash as string
                                                    }
                                                })
                                            }
                                            return "Image uploaded successfully."
                                        },
                                        loading: "Uploading image..."
                                    }
                                )
                            }
                        }
                    }
                    if (item.title === "YouTube") {
                        // add youtube video here,
                        setYoutubeDialogOpen(true)
                    } else if (item.title === "Page") {
                        setPageModelOpen(true)
                        // Command has the range. See if we can call command with collected data here.
                        // UseReducer to store all the data and then call command with that data, may be?
                    } else {
                        command(item)
                    }
                }
            },
            [items, complete, editor, token, command]
        )

        const upHandler = () => {
            setSelectedIndex((selectedIndex + items.length - 1) % items.length)
        }

        const downHandler = () => {
            setSelectedIndex((selectedIndex + 1) % items.length)
        }

        const enterHandler = () => {
            selectItem(selectedIndex)
        }

        const handleYoutubeLinkAdd = () => {
            if (youtubeLink === null) return

            setYoutubeDialogOpen(false)
            // add youtube video here,
            editor.chain().focus().setYoutubeVideo({ src: youtubeLink }).run()

            setYoutubeLink(null)
        }

        const handlePageSelection = ({
            id,
            slug,
            name
        }: Pick<Page, "id" | "slug" | "name">) => {
            setPageModelOpen(false)
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setPage({ id, slug, name })
                .run()
        }

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (event.key === "ArrowUp") {
                    upHandler()
                    return true
                }

                if (event.key === "ArrowDown") {
                    downHandler()
                    return true
                }

                if (event.key === "Enter") {
                    enterHandler()
                    return true
                }

                return false
            }
        }))

        useEffect(() => {
            setSelectedIndex(0)
        }, [items])

        // Insert chunks of the generated text
        const prev = useRef("")

        useEffect(() => {
            if (!isLoading || !editor) return
            const diff = completion.slice(prev.current.length)
            prev.current = completion
            editor?.commands.insertContent(diff)
        }, [isLoading, editor, completion])

        // Patch for scrolling the commandslist component when the user presses the up and down arrow keys
        const commandListContainer = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const container = commandListContainer?.current
            const item = container?.children[selectedIndex] as HTMLElement
            if (item && container) updateScrollView(container, item)
        }, [selectedIndex])

        return items.length > 0 ? (
            <>
                <div
                    id="slash-command"
                    ref={commandListContainer}
                    className="z-50 h-auto max-h-[30rem] w-72 overflow-y-auto scroll-smooth rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-md transition-all">
                    {sortedItems.map((item: SortedItem, _index: number) => {
                        return (
                            <>
                                <h4>{item.category}</h4>
                                {item.items.map((item, index) => (
                                    <button
                                        type="button"
                                        className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-slate-200 hover:bg-slate-800 ${
                                            index === selectedIndex
                                                ? "bg-slate-800 text-slate-200"
                                                : ""
                                        }`}
                                        key={`${item.title.toLowerCase()}`}
                                        onClick={() => selectItem(index)}>
                                        <div className="flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-700/50 bg-slate-900">
                                            {item.title ===
                                                "Continue writing" &&
                                            isLoading ? (
                                                <Loader
                                                    className="animate-spin"
                                                    size={16}
                                                />
                                            ) : (
                                                item.icon
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-slate-200">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )
                    })}
                </div>
                {/* Youtube Dialog */}
                <CustomDialogBox
                    open={youtubeDialogOpen}
                    onOpenChange={setYoutubeDialogOpen}>
                    <div className="flex flex-col space-y-4">
                        <div className="mb-8">
                            <h2 className="text-xl text-slate-200">
                                YouTube™ Link
                            </h2>
                            <p className="text-slate-500">
                                Please paste a YouTube™ link to add to your
                                page
                            </p>
                        </div>
                        <input
                            className="input"
                            placeholder="https://www.youtube.com/xxxx/xxxx"
                            type="text"
                            onChange={e => setYoutubeLink(e.target.value)}
                        />
                        <div className="w-full flex items-center justify-end space-x-4">
                            <Button
                                variant="secondary"
                                onClick={() => setYoutubeDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => handleYoutubeLinkAdd()}>
                                Add
                            </Button>
                        </div>
                    </div>
                </CustomDialogBox>

                {/* Page Modal */}
                <CustomDialogBox
                    open={pageModalOpen}
                    onOpenChange={setPageModelOpen}>
                    <AllPagesList
                        // @ts-expect-error custom type hasn't been added yet
                        parentId={editor.options.editorProps.attributes.pageId}
                        key={Date.now()}
                        handlePageSelection={page =>
                            handlePageSelection({
                                id: page.id,
                                slug: page.slug,
                                name: page.name
                            })
                        }
                    />
                </CustomDialogBox>
            </>
        ) : null
    }
)

export default CommandDropdownList

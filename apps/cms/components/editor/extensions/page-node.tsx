import {
    Node,
    NodeViewWrapper,
    NodeViewWrapperProps,
    ReactNodeViewRenderer,
    mergeAttributes
} from "@tiptap/react"
import { deletePage } from "app/server/page-actions"
import clsx from "clsx"
import ButtonWithFeedback from "components/button-with-feedback"
import { cn } from "lib/utils"
import Link from "next/link"
import { ArrowRight, Trash } from "react-feather"
import toast from "react-hot-toast"

type SetPageOptions = {
    slug: string
    id: string
    name: string
    description?: string
    featured?: string
    featuredimage?: string
}

declare module "@tiptap/core" {
    // eslint-disable-next-line
    interface Commands<ReturnType> {
        page: {
            /**
             * Insert a Page node
             */
            // eslint-disable-next-line no-unused-vars
            setPage: (options: SetPageOptions) => ReturnType
        }
    }
}

export default Node.create({
    name: "page-node",
    inline: false,
    group: "block",
    draggable: true,
    atom: true,
    // isolating: true,
    defining: true,
    gapCursor: true,
    addAttributes() {
        return {
            slug: {
                default: null,
                parseHTML: element => element.getAttribute("data-slug"),
                renderHTML: attributes => {
                    return {
                        "data-slug": attributes.slug
                    }
                }
            },
            id: {
                default: null,
                parseHTML: element => element.getAttribute("data-id"),
                renderHTML: attributes => {
                    return {
                        "data-id": attributes.id
                    }
                }
            },
            name: {
                default: null
            },
            featured: {
                default: null
            },
            featuredImage: {
                default: null
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="page-node"]'
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": "page-node" }),
            0
        ]
    },
    // Prevent delete or backspace from deleting the node
    addKeyboardShortcuts() {
        const isFeatured = this.editor.getAttributes("page-node").featured
        return {
            Backspace: () => {
                if (this.editor.isActive("page-node") && !isFeatured) {
                    return true
                }
                return false
            },
            Delete: () => {
                // This prevents the node from being deleted when the user presses backspace
                if (this.editor.isActive("page-node") && !isFeatured) {
                    return true
                }
                return false
            }
        }
    },

    addCommands() {
        return {
            setPage:
                (options: SetPageOptions) =>
                ({ commands }) => {
                    console.log("setPage options:", options)
                    return commands.insertContent({
                        type: "page-node",
                        attrs: options
                    })
                }
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(PageNodeView)
    }
})

export const PageNodeView = (props: NodeViewWrapperProps) => {
    const { node, selected, editor, deleteNode } = props
    console.debug("PageNodeView Props:", props)
    const siteId = editor.options.editorProps.attributes.siteId as string

    // form action
    // const [state, deleteAction] = useFormState(deletePage.bind(node.), null)

    return (
        <NodeViewWrapper data-type="page-node" contentEditable={false}>
            <div
                contentEditable={false}
                className={cn(
                    "bg-slate-950 rounded-md shadow flex items-center justify-between",
                    selected && "border-2 border-slate-600"
                )}>
                <Link
                    className={clsx(
                        "flex items-center pl-2 pr-2 hover:pl-2 w-[50vw] py-2 bg-transparpent rounded text-white ring-0 hover:opacity-90 hover:bg-slate-60"
                    )}
                    id={node.attrs.id}
                    href={`/${siteId}/${node.attrs.slug}`}
                    {...node.attrs}>
                    <span>{node.attrs.name || node.attrs.slug}</span>
                    <ArrowRight height="14" />
                </Link>
                <ButtonWithFeedback
                    variant="tertiary"
                    // eslint-disable-next-line no-alert
                    onClick={async () => {
                        const response = await deletePage(node.attrs.id)
                        if (!response.success) {
                            toast.error(response.message)
                            return
                        }
                        deleteNode()
                        toast.success(response.message)
                    }}>
                    <Trash />
                </ButtonWithFeedback>
            </div>
        </NodeViewWrapper>
    )
}

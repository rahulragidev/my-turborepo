import { cn } from "@repo/utils/src/cn"
import { Node, NodeViewProps } from "@tiptap/core"
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer
} from "@tiptap/react"
import { useRouter } from "next/navigation"
import Button from "../../Button"

interface SetButtonOptions {
    inline: boolean
    href: string
    target: string
    variant: "primary" | "secondary" | "tertiary"
}

declare module "@tiptap/core" {
    // eslint-disable-next-line
    interface Commands<ReturnType> {
        button: {
            /**
             * Insert a Page node
             */
            // eslint-disable-next-line no-unused-vars
            setButton: (options: SetButtonOptions) => ReturnType
        }
    }
}

const ButtonNodeView = (props: NodeViewProps) => {
    const { node } = props
    const router = useRouter()

    return (
        <NodeViewWrapper>
            <Button onClick={() => router.push(node.attrs.href)}>
                {node.attrs.text}
            </Button>
        </NodeViewWrapper>
    )
}

const ButtonNode = Node.create({
    name: "button",
    group: "inline",
    inline: true,
    atom: true,
    content: "inline*",
    isolating: true,
    defining: true,

    addAttributes() {
        return {
            href: {
                default: null
            },
            target: {
                default: null
            },
            rel: {
                default: null
            },
            text: {
                default: "Click me!"
            },
            variant: {
                default: "primary"
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: "button"
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ["button", HTMLAttributes, 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ButtonNodeView)
    }
})

export default ButtonNode

import { InputRule } from "@tiptap/core"
import { Color } from "@tiptap/extension-color"
import Document from "@tiptap/extension-document"
import Highlight from "@tiptap/extension-highlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import TiptapImage from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextStyle from "@tiptap/extension-text-style"
import TiptapUnderline from "@tiptap/extension-underline"
import Youtube from "@tiptap/extension-youtube"
import StarterKit from "@tiptap/starter-kit"
import UploadImagesPlugin from "../plugins/upload-images"
import ButtonNode from "@repo/tiptap-custom-extensions/src/button-node"
import CustomKeymap from "./custom-keymap"
import FeaturedBlogsSectionExtension from "./featured-blogs"
import FeaturedCardNode from "./featured-page-card"
import InlinePageLink from "./inline-page-link"
import PageNodeExtension from "./page-node"
import PageReference from "./page-referrence"
import SlashCommand from "./slash-command"
import UpdatedImage from "./updated-image"

const CustomDocument = Document.extend({
    content: "heading block*"
})

const defaultExtensions = [
    // CustomDocument,
    StarterKit.configure({
        // document: fals e,
        bulletList: {
            HTMLAttributes: {
                class: "list-disc list-outside leading-3 -mt-2"
            }
        },
        orderedList: {
            HTMLAttributes: {
                class: "list-decimal list-outside leading-3 -mt-2"
            }
        },
        listItem: {
            HTMLAttributes: {
                class: "leading-normal -mb-2"
            }
        },
        blockquote: {
            HTMLAttributes: {
                class: "border-l-4 border-slate-700"
            }
        },
        codeBlock: {
            HTMLAttributes: {
                class: "rounded-sm bg-slate-100 p-5 font-mono font-medium text-slate-800"
            }
        },
        code: {
            HTMLAttributes: {
                class: "rounded-md bg-slate-200 px-1.5 py-1 font-mono font-medium text-slate-900",
                spellcheck: "false"
            }
        },
        horizontalRule: false
    }),
    // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
    HorizontalRule.extend({
        addInputRules() {
            return [
                new InputRule({
                    find: /^(?:---|—-|___\s|\*\*\*\s)$/,
                    handler: ({ state, range }) => {
                        const attributes = {}

                        const { tr } = state
                        const start = range.from
                        const end = range.to

                        tr.insert(
                            start - 1,
                            this.type.create(attributes)
                        ).delete(tr.mapping.map(start), tr.mapping.map(end))
                    }
                })
            ]
        }
    }).configure({
        HTMLAttributes: {
            class: "mt-4 mb-6 border-t border-slate-300"
        }
    }),
    TiptapImage.extend({
        addProseMirrorPlugins() {
            return [UploadImagesPlugin()]
        }
    }).configure({
        allowBase64: true,
        HTMLAttributes: {
            class: "rounded-lg border border-slate-200"
        }
    }),
    UpdatedImage.configure({
        allowBase64: true,
        HTMLAttributes: {
            class: "rounded-lg border border-slate-200"
        }
    }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === "heading") {
                switch (node.attrs.level) {
                    case 1:
                        return `Title`
                    case 2:
                        return `Subtitle`
                    case 3:
                        return `Small Heading`
                    default:
                        return `Title`
                }
            }
            if (node.type.name === "button") {
                return ""
            }
            return "Press / to add blocks, or just start typing..."
        },
        includeChildren: true
    }),
    SlashCommand,
    TiptapUnderline,
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true
    }),
    TaskList.configure({
        HTMLAttributes: {
            class: "not-prose pl-2"
        }
    }),
    TaskItem.configure({
        HTMLAttributes: {
            class: "flex items-start my-4"
        },
        nested: true
    }),
    Youtube.configure({
        modestBranding: true,
        progressBarColor: "blue",
        HTMLAttributes: {
            class: "w-full rounded-xl focus:border-2 focus:border-blue-500"
        }
    }),
    // Markdown.configure({
    //	html: false,
    //	transformCopiedText: true,
    //	transformPastedText: true,
    // }),
    CustomKeymap,
    // DragAndDrop,
    PageNodeExtension,
    FeaturedBlogsSectionExtension,
    FeaturedCardNode,
    PageReference,
    ButtonNode,
    InlinePageLink
]

export default defaultExtensions

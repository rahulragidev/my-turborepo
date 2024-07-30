"use client"

import { useEditor, EditorContent, JSONContent, Node } from "@tiptap/react"
import templateExtensions from "./template-extensions"

const Tiptap = ({
    content,
    htmlContent
}: {
    content?: JSONContent
    htmlContent?: string
}) => {
    const editor = useEditor({
        extensions: [...templateExtensions],
        editable: false,
        onCreate: ({ editor }) => {
            console.log("content received", content)
            if (content) {
                editor.commands.setContent(content)
                return
            }
            if (htmlContent) {
                editor.commands.setContent(htmlContent)
                return
            }
        }
    })

    return <EditorContent editor={editor} readOnly={true} />
}

export default Tiptap

/**
 * Car - 1L
 * Business Loan - 0.75L
 * House Rent - 0.66L
 * Home Maintainence - 1L
 * Groceries - 0.5L
 * Total - 3.91L
 */

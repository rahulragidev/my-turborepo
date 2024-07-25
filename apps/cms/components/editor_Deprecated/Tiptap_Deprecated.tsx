"use client"

/* eslint-disable react/destructuring-assignment */
import Link from "@tiptap/extension-link"
import { EditorContent, JSONContent, useEditor } from "@tiptap/react"
import { useCompletion } from "ai/react"
import useToken from "dataHooks/useToken"
import UploadFile from "libs/uploadFile"
import { useCallback, useEffect, useRef } from "react"
import { FileDrop } from "react-file-drop"
import { toast } from "react-hot-toast"
import BubbleMenuComponent from "./BubbleMenu_Deprecated"
import TiptapExtensions from "./tiptap-extensions_Deprecated"

type onChangeFunction = (_value: any, _doc: JSONContent, _id: string) => void

// make a new parser
// const parser = new DOMParser()

const TipTap = (props: {
    content: string
    slug: string
    id: string
    onChange: onChangeFunction
}) => {
    const { id, slug, content, onChange } = props
    // const token = useToken()
    const { data: token, mutate: tokenMutate } = useToken()

    const editor = useEditor({
        content,
        extensions: [...TiptapExtensions],
        onCreate: ({ editor }) => {
            console.log("Tiptap on Created", editor)
            editor.setOptions({
                editorProps: {
                    attributes: {
                        pageId: id,
                        pageSlug: slug
                    }
                }
            })
        },
        onDestroy: () => {
            console.log("Tiptap onDestroy")
        },
        onUpdate: ({ editor }) => {
            const html: string = editor.getHTML()
            const doc = editor.getJSON()
            console.log("Tiptap JSON", doc)
            // console.log("1️⃣ Tiptap content Update", html)
            onChange(html, doc, id)
            editor.setOptions({
                editorProps: {
                    attributes: {
                        pageId: id,
                        pageSlug: slug
                    }
                }
            })

            // AI stuff
            const { selection } = editor.state
            const lastTwo = editor.state.doc.textBetween(
                selection.from - 2,
                selection.from,
                "\n"
            )
            if (lastTwo === "++" && !isLoading) {
                editor.commands.deleteRange({
                    from: selection.from - 2,
                    to: selection.from
                })
                // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
                complete(editor.getText())
                // complete(e.editor.storage.markdown.getMarkdown());
                // va.track("Autocomplete Shortcut Used")
            }
        },
        onTransaction: () => {
            // console.log("Tiptap onTransaction", transaction)
            // mutate the token on transaction if it's undefined or empty. We need token for image upload or deletion.
            if (!token) {
                tokenMutate()
            }
        },
        autofocus: "end",
        // onBlur(e) {
        // 	// trigger enter if editor is not empty and if it's not already focused on a new
        // 	if (e.editor.state.doc.content.lastChild?.content.size !== 0) {
        // 		debugger
        // 		console.log(
        // 			"cursor is at end?",
        // 			e.editor.state.doc.content.lastChild?.content.size === 0
        // 		)
        // 		e.editor.commands.enter()
        // 	}
        // },
        // onTransaction: ({ editor, transaction }) => {
        // 	// console.log("Tiptap onTransaction")
        // 	// console.log("Tiptap onTransaction", editor.getHTML())
        // 	// console.log("Tiptap onTransaction", transaction)
        // },
        enablePasteRules: [
            Link,
            "horizontalRule",
            "bulletList",
            "orderedList",
            "heading",
            "paragraph",
            "image",
            "blockquote"
        ]
    })

    const _resetTiptap = useCallback(() => {
        editor!.commands.setContent(content, true)
    }, [content, editor])

    useEffect(() => {
        // alert("route changed to ",)
        editor?.commands.setContent(content, true)
        // Warning: Don't correct / worry about the dependency array
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    // AI Stuff
    const { complete, completion, isLoading, stop, setCompletion } =
        useCompletion({
            id: "novel",
            api: "/api/generate",
            onResponse: (response: Response) => {
                if (response.status === 429) {
                    toast.error(
                        "You have reached your request limit for the day."
                    )
                    // va.track("Rate Limit Reached")
                }
            },
            onFinish: (_prompt: any, completion: string | any[]) => {
                editor?.commands.setTextSelection({
                    from: editor.state.selection.from - completion.length,
                    to: editor.state.selection.from
                })
                stop()
                setCompletion("")
            },
            onError: () => {
                toast.error("Something went wrong.")
            }
        })

    const prev = useRef("")

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
                        to: editor.state.selection.from
                    })
                }
                editor?.commands.insertContent("++")
            }
            // prevent user from typing when AI is loading
            if (isLoading) {
                e.preventDefault()
                e.stopPropagation()
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

    /**
     * Image Upload stuff
     */
    const handleImageDrop = async (file: FileList | null) => {
        console.log("handleImageDrop", file)

        if (!file) return
        if (!token) {
            console.error("No token")
            return
        }

        toast
            .promise(UploadFile(file[0] as File, token), {
                loading: "Uploading image...",
                success: "Image uploaded successfully",
                error: error => error || "Something went wrong"
            })
            .then(uploadResponse => {
                if (uploadResponse.success) {
                    // using insertContent so that we can add assetID to the image
                    editor?.commands.insertContent({
                        type: "image",
                        attrs: {
                            src: uploadResponse?.data?.variants?.[0] as string,
                            assetId: uploadResponse?.data?._id as string,
                            blurDataURL: uploadResponse?.data
                                ?.blurhash as string
                        }
                    })
                }
            })
            .catch(error => {
                console.error(error)
                toast.error(error)
            })
    }

    return (
        <FileDrop
            draggingOverFrameClassName="border-2 border-dashed border-slate-200"
            onDrop={e => handleImageDrop(e)}>
            {editor && <BubbleMenuComponent editor={editor} />}

            <EditorContent
                onClick={() => {
                    // Click anywhere to focus on new line
                    if (!editor?.isFocused) {
                        editor?.commands.focus()
                    }
                }}
                editor={editor}
                id={id}
                className="min-h-screen px-6 md:px-0 max-w-7xl mx-auto"
            />
        </FileDrop>
    )
}

export default TipTap

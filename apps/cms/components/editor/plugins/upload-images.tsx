/* eslint-disable no-param-reassign */
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view"
import { toast } from "react-hot-toast"

/**
 * Summary:
 * This code implements an image upload feature for a Tiptap-based text editor.
 * The main components are:
 * 1. UploadImagesPlugin: A ProseMirror plugin that manages image placeholders during upload.
 * 2. startImageUpload: Initiates the upload process, reading the file and displaying a placeholder.
 * 3. handleImageUpload: Manages the server-side upload of the image and user notifications.
 * 4. doImageUpload: Performs the actual image upload to a server.
 * 5. setImageUploadToken: Sets the authentication token for uploads.
 *
 * Algorithm and Data Flow:
 * - When an image file is selected for upload, startImageUpload checks the file type and size.
 * - If valid, it reads the file and creates a placeholder in the editor using a ProseMirror transaction.
 * - handleImageUpload then uploads the file to a server, updating the user on the upload status.
 * - Upon successful upload, the placeholder in the editor is replaced with the actual image.
 * - The sequence of function invocations typically is: startImageUpload (triggered from slashcommands) -> handleImageUpload -> doImageUpload.
 */

const uploadImagePluginKey = new PluginKey("upload-image")

// Global variable for storing the image upload authentication token
let imageUploadToken: string | undefined

// Sets the authentication token for image uploads
export const setImageUploadToken = (token: string) => {
    imageUploadToken = token
}

// Plugin for handling the insertion and removal of image placeholders during upload
const UploadImagesPlugin = () =>
    new Plugin({
        key: uploadImagePluginKey,
        state: {
            // Initializes the plugin state with an empty set of decorations (image placeholders)
            init() {
                return DecorationSet.empty
            },
            // Updates the state based on editor transactions (e.g., adding/removing placeholders)
            apply(tr, set) {
                set = set.map(tr.mapping, tr.doc)

                const action = tr.getMeta(uploadImagePluginKey)
                if (action && action.add) {
                    const { id, pos, src } = action.add
                    const placeholder = createImagePlaceholder(src)
                    const deco = Decoration.widget(pos + 1, placeholder, { id })
                    set = set.add(tr.doc, [deco])
                } else if (action && action.remove) {
                    set = set.remove(
                        set.find(
                            undefined,
                            undefined,
                            spec => spec.id === action.remove.id
                        )
                    )
                }
                return set
            }
        },
        props: {
            // Provides the decorations to the editor view, which in this case are the image placeholders
            decorations(state) {
                return this.getState(state)
            }
        }
    })

export default UploadImagesPlugin

// Initiates the image upload process when a file is selected in the editor
export function startImageUpload(file: File, view: EditorView, pos: number) {
    /**
     * This function is triggered from the slash-commands
     */

    if (!file.type.includes("image/")) {
        toast.error("File type not supported.")
        return
    }
    if (file.size / 1024 / 1024 > 20) {
        toast.error("File size too big (max 20MB).")
        return
    }

    // A fresh object to act as the ID for this upload
    const id = {}

    // Delete the current selection
    const { tr } = view.state
    if (!tr.selection.empty) tr.deleteSelection()

    // Insert the placeholder
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
        console.log("readerResult", reader.result)
        tr.setMeta(uploadImagePluginKey, {
            add: {
                id,
                pos,
                src: reader.result
            }
        })
        view.dispatch(tr)
    }

    // Upload the image and replace the placeholder with the actual image
    handleImageUpload(file).then(src => {
        const { schema } = view.state

        // Find the position of the placeholder in the editor state
        const pos = findPlaceholder(view.state, id)
        if (pos == null) return

        // Create a new image node and replace the placeholder with it
        const imageSrc = typeof src === "object" ? reader.result : src
        const node = schema!.nodes!.image!.create({ src: imageSrc })
        const transaction = view.state.tr
            .replaceWith(pos, pos, node)
            .setMeta(uploadImagePluginKey, { remove: { id } })
        view.dispatch(transaction)
    })
}

// Creates a placeholder element for an image being uploaded
const createImagePlaceholder = (src: string) => {
    const placeholder = document.createElement("div")
    placeholder.setAttribute("class", "img-placeholder")
    const image = document.createElement("img")
    image.setAttribute("class", "opacity-40 rounded-lg border border-slate-200")
    image.src = src
    placeholder.appendChild(image)
    return placeholder
}

// Finds the position of the placeholder in the editor state
function findPlaceholder(state: EditorState, id: {}) {
    const decos = uploadImagePluginKey.getState(state)
    const found = decos.find(null, null, (spec: { id: {} }) => spec.id === id)
    return found.length ? found[0].from : null
}

// Performs the actual image upload to the server
const doImageUpload = async (file: File) => {
    const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT
    if (typeof apiUrl !== "string") {
        console.error(
            "Environment variable not found, reading image locally instead."
        )
        return file
    }

    if (!imageUploadToken) {
        console.error("Upload token not found, reading image locally instead.")
        return file
    }

    const fd = new FormData()
    fd.append("file", file)

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${imageUploadToken}`
        },
        body: fd
    }

    const res = await fetch(apiUrl, options)
    if (!res.ok) {
        throw new Error("Error uploading image. Please try again.")
    }

    const { variants } = await res.json()
    const url = variants[0]

    return new Promise(resolve => {
        const image = new Image()
        image.src = url
        image.onload = () => {
            resolve(url)
        }
    })
}

// Handles user feedback and error handling during image upload
export const handleImageUpload = async (file: File) => {
    const id = toast.loading("Uploading image...")
    try {
        const result = await doImageUpload(file)
        toast.success("Image uploaded successfully.", { id })
        return result
    } catch (err) {
        toast.error(err instanceof Error ? err.message : String(err), { id })
        throw err
    }
}

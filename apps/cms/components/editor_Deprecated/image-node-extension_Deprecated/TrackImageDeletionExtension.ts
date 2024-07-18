import { Extension } from "@tiptap/core"
import trackImageDeletion from "./trackImageDeletionPlugin"

const TrackImageDeletionExtension = Extension.create({
	name: "trackImageDeletion",
	addOptions() {
		return {
			token: null,
		}
	},
	addProseMirrorPlugins() {
		return [trackImageDeletion(this.options.token)]
	},
})

export default TrackImageDeletionExtension

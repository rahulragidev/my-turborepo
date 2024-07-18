import { Extension } from "@tiptap/core"
import trackNodeDeletePlugin from "./track-node-delete-plugin_Deprecated"

const TrackNodeDeleteExtension = Extension.create({
	name: "track-node-delete-extension",
	addOptions() {
		return {
			token: null,
		}
	},
	addProseMirrorPlugins() {
		return [trackNodeDeletePlugin()]
	},
})

export default TrackNodeDeleteExtension

import deleteFile from "libs/deleteFile"
import { EditorState, Plugin, PluginKey, Transaction } from "prosemirror-state"

const trackImageDeletionKey = new PluginKey("trackImageDeletion")

const trackImageDeletion = (token: string | null): Plugin => {
	return new Plugin({
		key: trackImageDeletionKey,
		state: {
			init: () => ({ token }),
			apply: (_tr, prevState) => {
				// If needed, you can update the token in response to transactions here.
				return prevState
			},
		},
		appendTransaction(
			transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState
		): Transaction | null | undefined {
			try {
				let imageDeleted = false
				let assetId: string | null = null
				// const { token } = pluginState
				const pluginState = trackImageDeletionKey.getState(oldState) // or newState
				const { token } = pluginState

				transactions.forEach(transaction => {
					if (transaction.docChanged) {
						debugger
						const oldDoc = oldState.doc
						const newDoc = newState.doc
						const diffStart = oldDoc.content.findDiffStart(newDoc.content)
						if (diffStart != null) {
							const diffEnd = oldDoc.content.findDiffEnd(newDoc.content)
							if (diffEnd != null) {
								const oldDiffEnd = diffEnd.a
								const newDiffEnd = diffEnd.b
								oldDoc.nodesBetween(
									diffStart,
									oldDiffEnd,
									(oldNode, _oldPos) => {
										if (oldNode.type.name === "image") {
											let found = false
											newDoc.nodesBetween(
												diffStart,
												newDiffEnd,
												newNode => {
													if (newNode === oldNode) {
														found = true
													}
												}
											)
											if (!found) {
												console.log(
													"Image node is being deleted:",
													oldNode
												)
												imageDeleted = true
												assetId = oldNode.attrs.assetId
											}
										}
									}
								)
							}
						}
					}
				})
				if (imageDeleted && assetId && token) {
					console.log("Delete Asset: ", assetId)
					console.log("Token passed", token)
					if (token) {
						deleteFile(assetId, token) // Ensure deleteFile handles errors internally
					}
				}
			} catch (error) {
				console.error("Error in trackImageDeletion plugin:", error)
			}

			return null // Ensure a null return if no new transaction is created
		},
	})
}

export default trackImageDeletion

import { EditorState, Plugin, PluginKey, Transaction } from "prosemirror-state"

const trackNodeDeletionPluginKey = new PluginKey("trackPageNodeDeletion")

const trackPageNodeDeletion = (token?: string | null): Plugin => {
	return new Plugin({
		key: trackNodeDeletionPluginKey,
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
				let pageDeleted = false
				let pageId: string | null = null
				// const { token } = pluginState
				const pluginState = trackNodeDeletionPluginKey.getState(oldState) // or newState
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
										if (oldNode.type.name === "page-node") {
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
													"Page node is being deleted",
													oldNode
												)
												pageDeleted = true
												pageId = oldNode.attrs.pageId
											}
										}
									}
								)
							}
						}
					}
				})
				if (pageDeleted && pageId && token) {
					console.log("Delete page: ", pageId)
					console.log("Token passed", token)
					return null
				}
			} catch (error) {
				console.error("Error in trackPageNodeDeletion plugin:", error)
			}

			return null // Ensure a null return if no new transaction is created
		},
	})
}

export default trackPageNodeDeletion

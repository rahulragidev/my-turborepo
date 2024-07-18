import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

const gridItems = [
	{ id: 1, text: "Item 1" },
	{ id: 2, text: "Item 2" },
	{ id: 3, text: "Item 3" },
	{ id: 4, text: "Item 4" },
]

const Grid = () => {
	const [items, setItems] = useState(gridItems)

	const handleDragEnd = (result: { source?: any; destination: any }) => {
		if (!result.destination) return
		const { source, destination } = result
		const newItems = [...items]
		const [reorderedItem] = newItems.splice(source.index, 1)
		newItems.splice(destination.index, 0, reorderedItem)
		setItems(newItems)
	}

	return (
		<div className="grid">
			<AnimatePresence>
				{items.map((item, index) => (
					<motion.div
						key={item.id}
						layout
						drag
						dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
						onDragEnd={(_event, info) => {
							handleDragEnd({
								source: { index },
								destination: {
									index: info.point.x > 0 ? index + 1 : index - 1,
								},
							})
						}}
						style={{ gridArea: `${index + 1} / 1 / span 1 / span 1` }}>
						{item.text}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

const Playground = () => {
	return <Grid />
}

export default Playground

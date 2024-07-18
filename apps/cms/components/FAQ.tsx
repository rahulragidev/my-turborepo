"use client"

import { useState } from "react"
import { ChevronDownCircle, ChevronRightCircle } from "react-iconly"

interface FAQProps {
	question: string
	answer: string
}

const FAQ = ({ faq }: { faq: FAQProps }) => {
	const [isActive, setIsActive] = useState(false)
	return (
		<button
			aria-label={isActive ? "Collapse" : "Expand"}
			type="button"
			onClick={() => setIsActive(!isActive)}
			className="w-full border-2 border-solid border-slate-500/30 rounded-lg px-2 py-4 text-start">
			{/* Question */}
			<div className="w-full flex space-x-2">
				{isActive ? <ChevronDownCircle filled /> : <ChevronRightCircle filled />}
				<div className="items-start flex flex-col">
					<h3>{faq.question}</h3>
					{isActive && <p>{faq.answer}</p>}
				</div>
			</div>
		</button>
	)
}

export default FAQ

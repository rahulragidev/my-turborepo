import React, { useEffect, useRef, useState } from "react"

// Define the component props, extending standard input element properties
interface AutoWidthInputProps extends React.HTMLProps<HTMLInputElement> {
	placeholder?: string
}

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
	placeholder = "",
	type = "text",
	...rest
}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const [inputWidth, setInputWidth] = useState("auto")

	useEffect(() => {
		if (inputRef.current === null) return
		const resizeObserver = new ResizeObserver(entries => {
			entries.forEach(_entry => {
				const tempSpan = document.createElement("span")
				document.body.appendChild(tempSpan)

				tempSpan.style.fontSize = getComputedStyle(inputRef.current!).fontSize
				tempSpan.style.fontFamily = getComputedStyle(inputRef.current!).fontFamily
				tempSpan.style.visibility = "hidden"
				tempSpan.style.whiteSpace = "nowrap"
				tempSpan.textContent = inputRef.current!.value || placeholder

				setInputWidth(`${tempSpan.offsetWidth + 6}px`) // +2 for padding

				document.body.removeChild(tempSpan)
			})
		})

		resizeObserver.observe(inputRef.current)

		// eslint-disable-next-line consistent-return
		return () => resizeObserver.disconnect()
	}, [placeholder])

	return (
		<input
			{...rest}
			ref={inputRef}
			type={type}
			placeholder={placeholder}
			style={{ width: inputWidth }}
		/>
	)
}

export default AutoWidthInput

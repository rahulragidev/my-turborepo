import * as RadixProgressBar from "@radix-ui/react-progress"
// import { ReactPropTypes } from "react"

const ProgressBar = ({ value }: { value: number }) => {
	return (
		<RadixProgressBar.Root
			className="realtive overflow-hidden bg-slate-700 rounded-full w-[300px] h-2 translate-z-0"
			value={value}>
			<RadixProgressBar.Indicator
				style={{ transform: `translateX(-${100 - value}%)` }}
				className="bg-white w-full h-full transition-transform"
			/>
		</RadixProgressBar.Root>
	)
}

export default ProgressBar

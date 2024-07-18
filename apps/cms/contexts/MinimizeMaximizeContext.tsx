// MinimizeMaximizeContext.js
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"

const MinimizeMaximizeContext = createContext({
	isMinimized: false,
	setIsMinimized: (_isMinimized: boolean) => {},
})

export function useMinimizeMaximize() {
	return useContext(MinimizeMaximizeContext)
}

export const MinimizeMaximizeProvider = ({
	children,
}: {
	children: ReactNode | ReactNode[]
}) => {
	const [isMinimized, setIsMinimized] = useState(false)
	// set this isMinimized to true if it's the viewport width is less than 768px
	useEffect(() => {
		const handleResize = () => {
			setIsMinimized(window.innerWidth < 768)
		}

		handleResize() // Check on initial render

		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const value = useMemo(() => ({ isMinimized, setIsMinimized }), [isMinimized])

	return (
		<MinimizeMaximizeContext.Provider value={value}>
			{children}
		</MinimizeMaximizeContext.Provider>
	)
}

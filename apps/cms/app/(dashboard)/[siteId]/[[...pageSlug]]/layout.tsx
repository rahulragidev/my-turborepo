"use client"
import { ReactNode } from "react"
import SiteNavigation from "./components/site-navigation"

const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
	return (
		<>
			<SiteNavigation />
			{children}
		</>
	)
}

export default Layout

import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"
import { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}

export default Layout

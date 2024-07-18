import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"
import { ReactNode } from "react"

const CreateSiteLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Header />
			<main className="min-h-screen">
				<div className="mx-auto max-w-6xl">{children}</div>
			</main>
			<Footer />
		</>
	)
}

export default CreateSiteLayout

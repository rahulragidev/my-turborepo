// eslint-disable-next-line camelcase
import { Roboto_Mono } from "next/font/google"
import React from "react"
import "../styles/globals.scss"
import "../styles/silka.css"
import "../styles/tiptap.scss"

import { Metadata } from "next"
import Providers from "./providers"

export const metadata: Metadata = {
	title: "Lokus | Personal Websites Made Simple",
	description:
		"Transform Your Online Presence with Our AI-Driven Personal Website Builder. Experience seamless content creation and publishing with a minimalist, distraction-free interface. Ideal for sharing stories and ideas effortlessly. Start your clutter-free digital journey today.",
	metadataBase: new URL("https://lokus.io"),
	alternates: {
		canonical: "/",
	},
}

const RobotoMono = Roboto_Mono({
	subsets: ["latin", "latin-ext"],
	display: "swap",
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en" className={RobotoMono.className}>
			<body className="bg-slate-950 antialiased">
				<Providers>
					{children}
					<div id="dialog-portal" />{" "}
				</Providers>
			</body>
			{/* Portal target to render dialog components */}
		</html>
	)
}

export default RootLayout

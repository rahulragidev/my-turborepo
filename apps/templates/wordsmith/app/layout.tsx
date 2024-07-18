import type { Metadata } from "next"
import "./globals.css"
import NavBar from "@/app/navbar"
import { TEMPLATE_NAME, apiEndpoint } from "@/config"
import Footer from "./footer"

import { Manrope } from "next/font/google"
import getSideById from "@/libs/getSiteById"
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })

export const generateMetadata = async () => {
	try {
		const siteResponse = await getSideById()
		const site = siteResponse?.data.data
		const siteData = site?.data
		if (!site || !siteData) return {}

		const ogImageURL = new URL(`https://${siteData?.primaryDomain}`)
		ogImageURL.pathname = "/og"
		ogImageURL.searchParams.append("sl", siteData?.textLogo as string)
		ogImageURL.searchParams.append("pt", siteData?.name as string)
		ogImageURL.searchParams.append("url", (siteData?.primaryDomain as string) ?? "")
		ogImageURL.searchParams.append("un", siteData?.owner?.name as string)

		return {
			title: site.data?.name,
			description: `welcome to ${site.data?.name}`,
			metadataBase: new URL(`https://${site.data?.primaryDomain}` as string),
			openGraph: {
				title: siteData?.name,
				images: [
					{
						url: ogImageURL.toString(),
					},
				],
				type: "website",
				siteName: siteData?.name ?? "Hemingway Template",
				url: `https://${siteData?.primaryDomain}`,
			},
		}
	} catch (error) {
		console.error(error)
		return {
			title: "Hemingway Template Lokus",
			description: "Hemingway Template by Lokus",
		}
	}
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${manrope.className} font-sans`}>
				<div className="flex-col justify-center py-6 px-4 mx-auto max-w-6xl bg-white md:px-10 xl:py-8 xl:px-40 align-center">
					<NavBar />
					<main className="py-24 content prose min-h-[80vh]">{children}</main>
				</div>
				<Footer />
			</body>
		</html>
	)
}

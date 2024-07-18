import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.scss"
import ThemeSelector from "@/app/components/ThemeChanger"
import NavBar from "@/app/components/navbar"
import Footer from "@/app/components/footer"
import CirclesBgSvg from "@/app/components/CirclesBgSvg"
import { ogVariants } from "@/libs/og/variants"
import { ImageResponse } from "next/og"
import getSideById from "@/libs/getSiteById"

const inter = Inter({ subsets: ["latin"] })

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
			<body className={inter.className}>
				<NavBar />
				<main className="py-24 content min-h-[80vh]">{children}</main>
				<Footer />

				<div className="fixed top-[50%] left-0 -z-10 w-screen h-screen flex items-center justify-center blur-[128px] opacity-65">
					<CirclesBgSvg />
				</div>
			</body>
			<ThemeSelector />
		</html>
	)
}

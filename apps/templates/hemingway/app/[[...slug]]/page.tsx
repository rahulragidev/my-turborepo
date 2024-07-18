import getAllPagesBySite from "@/libs/getAllPagesBySite"
import getPageBySlug from "@/libs/getPageBySlug"
import getSideById from "@/libs/getSiteById"
import slugToUse, { ParamsType } from "@/libs/slugToUse"
import { Page } from "@/types/generated/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Tiptap from "../components/tiptap/TipTap"

// generate all Params for this site
export const generateStaticParams = async () => {
	// fetch all pages by Site
	const pages = await getAllPagesBySite()

	// map the data to the params to construct an array
	const paths = pages.data?.data?.data?.map((page: Page) => ({
		params: { slug: page.slug },
	}))

	// return the array
	return paths
}

export async function generateMetadata({
	params,
}: {
	params: ParamsType
}): Promise<Metadata> {
	try {
		const page = await getPageBySlug(slugToUse(params))
		const site = await getSideById()

		const siteData = site?.data?.data?.data

		if (!page?.data?.data?.success) {
			throw new Error("Page not found")
		}

		const title = page.data.data?.data?.metaTitle ?? page.data.data?.data?.name
		const description = page.data.data?.data?.metaDescription ?? ""
		const primaryDomain = siteData?.primaryDomain
		console.log("primaryDomain", primaryDomain)

		const ogImageURL = new URL(`https://${siteData?.primaryDomain}`)
		ogImageURL.pathname = "/og"
		ogImageURL.searchParams.append("sl", siteData?.textLogo as string)
		ogImageURL.searchParams.append("pt", title as string)
		ogImageURL.searchParams.append("url", (siteData?.primaryDomain as string) ?? "")
		ogImageURL.searchParams.append("un", siteData?.owner?.name as string)

		return {
			title,
			description,
			metadataBase: new URL(`https://${siteData?.primaryDomain}` as string),
			openGraph: {
				title,
				description,
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
			openGraph: {
				title: "Hemingway Template Lokus",
				description: "Hemingway Template by Lokus",
			},
		}
	}
}

//export generateImageMetadata = async ({ params }: { params: ParamsType }):  => {
//	const page = await getPageBySlug(slugToUse(params))
//	const site = await getSideById()

//	return {

//	}
//}

// Next Step
// Run dev and see if repoTiptap is console logged

const Index = async ({ params }: { params: ParamsType }) => {
	const page = await getPageBySlug(slugToUse(params))

	

	if (!page?.data?.data?.success) {
		notFound()
	}

	return (
		<div
			suppressHydrationWarning
			className="content py-4 px-8 mx-auto max-w-5xl min-h-[calc(100vh-6rem)]">
			<Tiptap
				content={page?.data?.data?.data?.jsonBody}
				htmlContent={page?.data?.data?.data?.body as string}
			/>
			{/*<div
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: (page?.data?.data?.data?.body as string) || "",
				}}
			/>*/}
		</div>
	)
}

export default Index

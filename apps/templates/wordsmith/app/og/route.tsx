import { ImageResponse } from "next/og"
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const siteLogo = searchParams.get("sl")
	const pageTitle = searchParams.get("pt")
	const url = searchParams.get("url")
	const username = searchParams.get("un")

	return new ImageResponse(
		(
			<div
				tw="absolute flex flex-col justify-between w-full h-full top-0 left-0 text-black px-16 py-16 bg-[#FFF337]">
				<p tw="text-2xl font-extrabold tracking-tight my-0 ml-2">{siteLogo}</p>
				<p tw="capitalize text-8xl my-8">{pageTitle}</p>
				<div tw="flex w-full justify-between ml-2 pr-24">
					{url && <p tw="my-0">{url}</p>}
					<p tw="my-0">{username}</p>
				</div>
				{/*<p>{publishedAt}</p>*/}
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	)
}

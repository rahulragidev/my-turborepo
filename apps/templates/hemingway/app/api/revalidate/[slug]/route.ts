import { revalidationSecretKey } from "@/config"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

interface Params {
	slug: string
}

export async function POST(_req: NextRequest, { params }: { params: Params }) {
	const headersList = headers()
	const secretKey = headersList.get("X-Revalidation-Key")

	// Validate secret key
	if (secretKey !== revalidationSecretKey) {
		return NextResponse.json(
			{
				message: "Invalid key",
				ok: false,
			},
			{ status: 401 }
		)
	}

	try {
		const slug = params.slug
		revalidateTag(slug as string)

		return NextResponse.json(
			{
				message: `Revalidation request for ${slug} was successful`,
				ok: true,
			},
			{ status: 200 }
		)
	} catch (error) {
		return NextResponse.json(
			{
				ok: false,
				message: `Internal Server Error: ${
					error instanceof Error ? error.message : error
				}`,
			},
			{ status: 500 }
		)
	}
}

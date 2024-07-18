import { SignIn } from "@clerk/nextjs"
import LogoFull from "components/atoms/LogoFull"
import Link from "next/link"
import { useRouter } from "next/router"

const Page = () => {
	const router = useRouter()
	const { takeToCheckout, priceId } = router.query

	return (
		<main className="w-screen">
			<div className="mx-auto w-full md:w-[30vw]">
				<Link href="/" className="ml-8 mt-12">
					<div className="ml-10 mb-12 mt-24">
						<LogoFull width={120} />
					</div>
				</Link>
				<SignIn
					afterSignInUrl={
						takeToCheckout ? `/post-sign-in?priceId=${priceId}` : "/sites"
					}
					afterSignUpUrl={
						takeToCheckout ? `/post-sign-in?priceId=${priceId}` : "/sites"
					}
					redirectUrl={
						takeToCheckout ? `/post-sign-in?priceId=${priceId}` : "/sites"
					}
					// this needs to be dynamic if the query has createCheckout in it, it should take to the checkout page
					appearance={{
						layout: {
							logoPlacement: "outside",
							termsPageUrl: "/terms",
							shimmer: true,
							privacyPageUrl: "/privacy",
							showOptionalFields: true,
						},
						elements: {
							footer: true,
							headerTitle: {
								fontSize: "2rem",
							},
							headerSubtitle: {
								fontSize: "1",
							},
							button: {
								fontSize: "1rem",
							},
							socialButtons: {
								fontSize: "1rem",
							},
							socialButtonsBlockButton: {
								fontSize: "1rem",
							},
							formButtonPrimary: {
								fontSize: "1rem",
								padding: "1rem",
							},
							card: {
								width: "100%",
								maxWidth: "100%",
								marginRight: 0,
								fontSize: "2rem",
							},
							rootBox: {
								width: "100%",
							},
						},
					}}
				/>
				<div className="ml-12 mt-8 w-full">
					<p className="text-slate-100 text-lg">
						By signing in, you agree to our{" "}
						<Link href="/terms">
							<span className="mb-1 underline">Terms and conditions</span>
						</Link>
					</p>
					<p className=" text-slate-200">
						&copy; {new Date().getFullYear()} Lokus, LLC. All rights reserved.
					</p>
				</div>
			</div>
		</main>
	)
}

export default Page

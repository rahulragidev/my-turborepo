import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"

export const metadata = {
	title: "Lokus | Terms",
}

const Terms = () => {
	return (
		<>
			<Header />
			<main className="w-full max-w-screen">
				<section className="flex items-start flex-col justify-center pt-24 mx-auto max-w-6xl px-4">
					<div className="py-32 text-slate-400 max-w-4xl">
						<h1 className="text-5xl font-semibold">Terms</h1>
						<p>Version 0.1</p>
						<p>Last updated: 15 January 2023</p>
						<div className="mt-24 space-y-4">
							<h2 className="text-3xl mb-2 font-semibold">Eligibility</h2>
							<p>
								The Service is available only for individuals aged 13
								years or older. If you are age 13 or older but under the
								age of 18, or the legal age of majority where you reside
								if that jurisdiction has an older age of majority, then
								you agree to review these Terms of Service with your
								parent or guardian to make sure that both you and your
								parent or guardian understand and agree to these Terms of
								Service. You agree to have your parent or guardian review
								and accept these Terms of Service on your behalf. If you
								are a parent or guardian agreeing to these Terms of
								Service for the benefit of a child over the age of 13,
								then you agree to and accept full responsibility for that
								child’s use of the Service, including all financial
								charges and legal liability that he or she may incur. We
								may, in our sole discretion, refuse to offer the Service
								to any person or entity and change the eligibility
								criteria for using the Service at any time. The right to
								access the Service is revoked where these Terms of Service
								or use of the Service is prohibited or to the extent
								offering, sale, or provision of the Service conflicts with
								any applicable law, rule or regulation.
							</p>
							<p>
								If you are entering into these Terms of Service on behalf
								of a company or other legal entity, you represent that you
								have the authority to bind such entity, its affiliates,
								and all users who access the Service through your account
								to these Terms of Service, in which case the terms “you”
								or “your” shall refer to such entity, its affiliates, and
								users associated with it. If you do not have such
								authority, or if you do not agree with these Terms of
								Service, you must not accept these Terms of Service and
								you may not use the Service. You further agree that you
								assume all responsibility and liability in connection with
								your use of the Service on behalf of such a company or
								other legal entity, and you shall be solely responsible
								for all disputes, if any, that arise due to your use of
								the Service on behalf of such a company or other legal
								entity.
							</p>
						</div>
					</div>
				</section>
				{/* <Footer /> */}
			</main>
			<Footer />
		</>
	)
}

export default Terms

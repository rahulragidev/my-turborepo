// import Footer from "components/layouts/Footer"
// import Nav from "components/layouts/Nav"

import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"

export const metadata = {
	title: "Lokus | Pricing",
}

const Privacy = () => {
	return (
		<>
			<Header />
			<main className="w-full max-w-screen">
				<section className="flex items-start flex-col justify-center pt-24 mx-auto max-w-6xl px-4">
					<div className="py-32 max-w-4xl">
						<h1 className="text-3xl font-medium">Privacy</h1>
						<p>Version 0.1</p>
						<p>Last updated: 23 Jan 2024</p>
						<div className="mt-24 space-y-4">
							<p>
								Your privacy is important to us. It is Lokus, LLC&apos;s
								policy to respect your privacy regarding any information
								we may collect from you across our website,{" "}
								<a
									className="text-blue-600 underline underline-offset-1"
									href="https://lokus.io">
									lokus.io
								</a>
								, and other sites and apps we own and operate.
							</p>
							<p>
								We collect personal information like your full name,
								email, and sometimes your profile picture (if you sign up
								with Google or Facebook). We also collect your IP address
								and browser user agent string to help spam detection. We
								use this information to provide you with services,
								including to verify your identity, to communicate with
								you, and to improve our services.
							</p>
							<p>
								We only retain collected information for as long as
								necessary to provide you with your requested service. What
								data we store, we’ll protect within commercially
								acceptable means to prevent loss and theft, as well as
								unauthorized access, disclosure, copying, use or
								modification.
							</p>
							<p>
								We don’t share any personally identifying information
								publicly or with third-parties, except when required to by
								law.
							</p>
							<p>
								Our website may link to external sites that are not
								operated by us. Please be aware that we have no control
								over the content and practices of these sites, and cannot
								accept responsibility or liability for their respective
								privacy policies.
							</p>
							<p>
								You are free to refuse our request for your personal
								information, with the understanding that we may be unable
								to provide you with some of your desired services.
							</p>
							<p>
								Your continued use of our website will be regarded as
								acceptance of our practices around privacy and personal
								information. If you have any questions about how we handle
								user data and personal information, feel free to contact
								us.
							</p>
							<p>This policy is effective as of 23 Jan 2023.</p>
						</div>
					</div>
				</section>
				{/* <Footer /> */}
			</main>
			<Footer />
		</>
	)
}

export default Privacy

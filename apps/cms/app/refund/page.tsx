import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"

export const metadata = {
	title: "Lokus | Refund",
}

const Refund = () => {
	return (
		<>
			<Header />
			<main className="w-full max-w-screen">
				<section className="flex items-start flex-col justify-center pt-24 mx-auto max-w-6xl px-4">
					<div className="py-32 max-w-4xl">
						<h1 className="text-3xl font-medium">Refund</h1>
						<p>Version 0.1</p>
						<p>Last updated: 8 Feb 2023</p>
						<div className="mt-24 space-y-4">
							<p>
								At Lokus, LLC, we offer a 14-day free trial to help our
								customers evaluate our service before committing to a full
								subscription. If for any reason you are not satisfied with
								our service during the trial period, you may cancel at any
								time and receive a full refund.
							</p>

							<p>
								We also have a fair Refund Policy for our subscribers. If
								you cancel your subscription within 10 days of starting
								the subscription, we will refund the subscription fee for
								the month. To request a refund, please contact us at
								support@lokus.io. Our customer support team will assist
								you in the process.
							</p>

							<p>
								Please note that the refund policy applies only to
								payments made directly to Lokus, LLC. If you purchased our
								service through a third-party platform, please refer to
								their refund policy for more information.
							</p>

							<p>
								This Refund Policy is governed by the laws of the State of
								Delaware and any applicable federal laws.
							</p>

							<p>
								If you have any questions regarding our Refund Policy,
								please do not hesitate to contact us.
							</p>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Refund

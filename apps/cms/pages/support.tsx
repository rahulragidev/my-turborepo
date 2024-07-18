// import Footer from "components/layouts/Footer"
// import Nav from "components/layouts/Nav"
import Head from "next/head"
import Image from "next/image"

const Terms = () => {
	return (
		<>
			<Head>
				<title>Lokus | Terms &amp; Privacy</title>
			</Head>
			{/* <Nav /> */}
			<main className="w-full max-w-screen">
				<section className="flex items-start flex-col justify-center pt-24 mx-auto max-w-7xl px-4">
					<div className="py-32 text-gray-800 max-w-4xl">
						<Image
							className="border-2 border-solid border-gray-300 rounded-lg"
							src="/lokus-square.png"
							alt="Lokus logo"
							height={200}
							width={200}
						/>
						<h1 className="text-5xl font-semibold">Support</h1>
						<p>
							For all support &amp; queries please contact{" "}
							<a
								href="mailto:support@lokus.io"
								className="text-blue-500 underline underline-offset-2">
								support@lokus.io
							</a>
						</p>
					</div>
				</section>
				{/* <Footer /> */}
			</main>
		</>
	)
}

export default Terms

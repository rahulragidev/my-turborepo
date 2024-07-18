import Chip from "components/atoms/Chip"
import Footer from "components/layouts/Footer"
import Header from "components/layouts/Header"
import ProductDemoSection from "./(landingpagecomponents)/product-demo-section"
import UspSection from "./(landingpagecomponents)/usp-section"
import HeroCta from "./hero-cta"

const Home = async () => {
	return (
		<>
			<Header />
			<main className="mt-20 max-w-screen">
				<section className="flex flex-col justify-center items-start mt-16 pb-8 px-2 mx-auto max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center max-w-6xl mx-auto px-2">
						<Chip>AI Powered. Clean. Efficient.</Chip>
						<h1 className="text-3xl md:text-5xl text-center mt-8">
							<span className="bg-slate-200 text-slate-900 px-2 rounded">
								Effortless Websites{" "}
							</span>
							<br /> for the Modern Creator
						</h1>
						<p className="mt-6 max-w-3xl md:text-xl text-gray-500 leading-[1.618] mb-6">
							Lokus eliminates the labyrinth of complex tools and clunky
							setup to help you launch your personal websites or a blog.
							Pick a name, template, and start blogging! No fuss. No
							clutter.
						</p>

						<div className="flex items-center space-x-2 my-4">
							<HeroCta />
						</div>
					</div>
				</section>
				{/* Product demo section */}
				<ProductDemoSection />
				{/* Unique selling Point section */}
				<UspSection />
				{/* Marquee section */}
				{/* <section>
					<div className="overflow-x-hidden w-full">
				 		<ul className="flex animate-marquee text-6xl">
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-300">
								Item 1
							</li>
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-400">
								Item 2
							</li>
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-500">
								Item 3
							</li>
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-300">
								Item 1
							</li>
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-400">
								Item 2
							</li>
							<li className="flex-shrink-0 w-64 h-32 mx-4 bg-gray-500">
								Item 3
							</li>
						</ul>
					</div>
				</section> */}
			</main>
			<Footer />

			{/* <FancyBg className="absolute h-screen w-screen -z-10 top-0 left-0" /> */}
		</>
	)
}

export default Home

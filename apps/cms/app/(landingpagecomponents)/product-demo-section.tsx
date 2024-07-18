"use client"

import Button from "components/Button"
import LogoFull from "components/atoms/LogoFull"
import { cn } from "lib/utils"
import {
	ArrowUpRight,
	ChevronDownCircle,
	Lock,
	Minimize2,
	Settings,
	SettingsIcon,
} from "lucide-react"
import Image from "next/image"
// import { useTheme } from "next-themes"

const ProductDemoSection = () => {
	// const { theme } = useTheme()
	return (
		<section className="relative w-screen max-w-screen px-0 md:px-12 py-0 md:py-16 md:mt-12">
			<LowFiBlogPage className="absolute top-0 left-0 right-0 inset-0 mx-auto z-0 rotate-6 -translate-y-12 translate-x-44" />
			<LowFiBlogPage className="absolute top-0 left-0 right-0 inset-0 mx-auto z-0 -rotate-6 -translate-x-32" />
			<LowFiBlogPage className="absolute top-0 left-0 right-0 inset-0 mx-auto z-0 -rotate-3 -translate-y-12 bg-slate-900" />
			<div className="absolute top-8 left-0 right-0 inset-0 mx-auto z-0  bg-slate-200/10 blur-xl h-[12rem] w-[50%]" />
			<div className="relative w-full md:w-11/12 md:max-w-[1200px] h-[80vh] md:h-[768px] mx-auto flex items-stretch rounded-2xl bg-slate-950 border-2 border-slate-900 text-sm pointer-events-none shadow-slate-900">
				{/* Sidemenu */}
				<div className="hidden md:flex flex-col h-full w-1/5 px-4 pt-6 pb-4 border-r border-solid border-slate-900">
					<div className="flex w-fit items-center space-x-2 rounded-full bg-slate-800/25 pl-4 pr-3 py-2">
						<p>johnnydeep</p>
						<ChevronDownCircle height={14} />
					</div>
					<div className="w-full py-8 h-full">
						<div className="flex items-center justify-between px-2 py-2 bg-slate-900 rounded-lg">
							<p>Home</p>
							<Lock height={12} />
						</div>
						<div className="flex items-center justify-between px-2 py-2">
							<p>Blog</p>
						</div>
						<div className="flex items-center justify-between px-2 py-2">
							<p>Contact</p>
						</div>
					</div>
					<div className="flex items-center space-x-2 px-2 py-2">
						<Settings height={12} />
						<p>Site Settings</p>
					</div>
					<div className="ml-3.5">
						<LogoFull width={48} />
					</div>
				</div>
				<div className="flex flex-col flex-1 overflow-hidden md:overflow-visible">
					{/* Page ToolBar */}
					<div className="flex items-center justify-between w-full px-8 py-4 space-x-2">
						<Button variant="tertiary" className="w-12 h-12 p-0" rounded>
							<Minimize2 height={12} />
						</Button>
						<div className="flex-1" />

						<Button variant="tertiary" className="-space-x-1 pl-4 pr-2">
							<span>Preview</span>
							<ArrowUpRight height={12} className="text-green-500  -mt-1" />
						</Button>
						<Button className="pointer-events-auto">
							<span>Publish</span>
						</Button>
						<Button variant="tertiary" className="w-12 h-12 p-0" rounded>
							<SettingsIcon height={12} />
						</Button>
					</div>
					{/* Content section */}
					<div className="w-full max-w-4xl mx-auto">
						{/* Content */}
						<div className="p-12">
							<Image
								alt="Johnny Deep"
								src="/images/johnnydeep-midjourney.png"
								height={240}
								width={240}
								className="object-cover rounded-xl"
							/>
							<h1 className="text-4xl font-bold mt-8">
								Hey! This is Johny Deep
								<br />
								<span className="text-slate-500 font-medium">
									Welcome to my personal website
								</span>
							</h1>
							<p className="mt-4 max-w-lg">
								Lokus is a personal website and blogging platform that
								lets you create and publish your content with ease. No
								more complex tools and clunky setup. Just pick a name,
								template, and start blogging! No fuss. No clutter.
							</p>

							<h2 className="text-3xl font-semibold mt-12 text-slate-400">
								Featured Blogs
							</h2>

							{/* Featured blog cards */}
							<div className="grid grid-cols-1 gap-4 mt-4">
								<div className="block md:flex items-center space-y-4 md:space-x-4 bg-slate-950/25 backdrop-blur-sm border border-solid rounded-lg p-4 shadow-md shadow-slate-900">
									<div className="w-24 h-24 rounded-lg bg-slate-900" />
									<div className="flex flex-col">
										<h3 className="text-xl font-semibold">
											How to get rich with photography
										</h3>
										<p className="text-slate-500 text-base">
											10 mental frameworks that help you get rich
											using your passion for photography
										</p>
										<p className="text-slate-500 mt-2">5 min read</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ProductDemoSection

const LowFiBlogPage = (props: { className: string }) => {
	const { className, ...otherProps } = props
	return (
		<div
			{...otherProps}
			className={cn(
				"hidden md:flex w-[40rem] h-[40rem] rounded-xl flex-col space-y-4 p-8 bg-slate-800",
				className
			)}>
			<div className="w-full h-12 bg-slate-950/50 rounded-lg" />
			<div className="w-full h-12 bg-slate-950/50 rounded-lg" />
			<div className="w-2/3 h-12 bg-slate-950/50 rounded-lg" />
			<div className="w-full h-12 bg-slate-950/50 rounded-lg mt-12" />
			<div className="w-2/3 h-12 bg-slate-950/50 rounded-lg" />
		</div>
	)
}

// import BetaChip from "components/atoms/BetaChip"
// import LogoFull from "components/atoms/LogoFull"
import LogoFull from "components/atoms/LogoFull"
import ThemeToggle from "components/ThemeToggle"
import Link from "next/link"

const Footer = () => {
	return (
		<footer className="flex flex-col justify-between items-start h-auto min-h-[38vh] bg-slate-900">
			<div className="py-12 px-4 mx-auto w-full max-w-6xl md:px-8">
				<Link href="/" passHref>
					<div className="flex items-center space-x-2">
						<LogoFull width={100} />
					</div>
				</Link>
				<small className="text-slate-400">
					Lokus, LLC <br />
					295, 447 Broadway, 2nd Floor <br />
					New York, NY 10013
				</small>
				<div className="flex justify-between items-center my-12">
					<p className="text-slate-500">
						Contact{" "}
						<a
							href="mailto:support@lokus.io"
							className="text-blue-500 underline underline-offset-2">
							support@lokus.io
						</a>
					</p>
					<ThemeToggle />
				</div>
				<hr className="mb-2 border-slate-300/20" />
				<div className="flex flex-col justify-between items-start space-y-2 space-x-0 md:flex-row md:items-center md:space-y-0 md:space-x-2 text-slate-500">
					<small>&copy; {new Date().getFullYear()} </small>
					<div className="flex flex-col items-start space-y-2 space-x-0 md:flex-row md:items-center md:space-y-0 md:space-x-2">
						<Link href="/terms">Terms</Link>
						<Link href="/pricing">Pricing</Link>
						<Link href="/refund">Refund</Link>
						<Link href="/privacy">Privacy</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer

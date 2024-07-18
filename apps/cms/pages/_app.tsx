import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/react"
import ThemeProvider from "components/theme-provider"
import type { AppProps } from "next/app"
import NextNprogress from "nextjs-progressbar"
import { Toaster } from "react-hot-toast"
import "styles/tiptap.scss"
import { SWRConfig } from "swr"
import "../styles/globals.scss"
import "../styles/silka.css"

// const notify = (message: string) => toast(message, { position: "bottom-right" })

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<ClerkProvider {...pageProps}>
			<Analytics />
			<SWRConfig
				value={{
					isOnline(): boolean {
						return navigator.onLine
					},
					onError: (error: any) => {
						console.error("swr error", error)
						// notify(error)
					},
					onLoadingSlow: key => {
						console.log("swr loading slow", key)
						// toast("It's taking longer than usual. Is your internet okay?", {
						// 	icon: "🤔",
						// 	position: "top-center",
						// })
					},
				}}>
				<ThemeProvider
					defaultTheme="system"
					enableSystem
					attribute="class"
					disableTransitionOnChange>
					<Component {...pageProps} />
				</ThemeProvider>
			</SWRConfig>
			<Toaster position="bottom-right" />
			<NextNprogress
				color="#C5C8CE"
				startPosition={0.3}
				stopDelayMs={200}
				height={4}
				showOnShallow
				options={{
					showSpinner: false,
				}}
			/>
		</ClerkProvider>
	)
}

export default App

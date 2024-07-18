"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { MinimizeMaximizeProvider } from "contexts/MinimizeMaximizeContext"
import { ThemeProvider } from "next-themes"
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"

const Providers = ({ children }: { children: ReactNode }) => (
	<ClerkProvider>
		<MinimizeMaximizeProvider>
			<ThemeProvider
				defaultTheme="system"
				attribute="class"
				enableSystem
				disableTransitionOnChange>
				<Toaster position="bottom-right" />
				{children}
			</ThemeProvider>
		</MinimizeMaximizeProvider>
	</ClerkProvider>
)

export default Providers

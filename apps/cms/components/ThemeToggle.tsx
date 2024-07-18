"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { cn } from "lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const ThemeToggle = ({ className }: { className?: string }) => {
	const { theme, systemTheme, setTheme } = useTheme()

	// DONOT remove this. It prevents hydration mismatch
	const [mounted, setMounted] = useState(false)

	// DONOT remove this. It prevents hydration mismatch
	useEffect(() => setMounted(true), [])

	// DONOT remove this. It prevents hydration mismatch
	if (!mounted) {
		return null
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild className={cn(className)}>
				<button type="button">
					{theme === "dark" && <Moon height="auto" />}
					{theme === "light" && <Sun height="auto" />}
					{theme === "system" && systemTheme === "dark" && (
						<Moon height="auto" />
					)}
					{theme === "system" && systemTheme === "light" && (
						<Sun height="auto" />
					)}
					{/* <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
					<span className="sr-only">Toggle theme</span>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					side="top"
					className="bg-slate-900 backdrop-blur-lg min-w-[8rem] rounded-lg overflow-hidden shadow-lg z-50">
					<DropdownMenu.Item
						className="flex items-center space-x-2 w-full border-b border-slate-700/40 px-4 py-2 hover:bg-slate-800 cursor-pointer"
						onClick={() => setTheme("light")}>
						<Sun height={16} /> <span> Light </span>
						{theme === "light" && (
							<div className="h-2 w-2 rounded-full bg-green-400" />
						)}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="flex items-center space-x-2 w-full border-b border-slate-700/40 px-4 py-2 hover:bg-slate-800 cursor-pointer"
						onClick={() => setTheme("dark")}>
						<Moon height={16} /> <span>Dark</span>
						{theme === "dark" && (
							<div className="h-2 w-2 rounded-full bg-green-400" />
						)}
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="flex items-center space-x-2 w-full border-slate-700/40 px-4 py-2 hover:bg-slate-800 cursor-pointer"
						onClick={() => setTheme("system")}>
						<Monitor height={16} /> <span>System</span>
						{theme === "system" && (
							<div className="h-2 w-2 rounded-full bg-green-400" />
						)}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

export default ThemeToggle

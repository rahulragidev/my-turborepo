import type { Config } from "tailwindcss"

const config: Config = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/*.css",
	],
	safelist: [
		{
			pattern: /rounded-.+/, // match all rounded-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /m-.+/, // match all m-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /mx-.+/, // match all mx-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /my-.+/, // match all my-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /mt-.+/, // match all mt-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /mb-.+/, // match all mb-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /ml-.+/, // match all ml-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /mr-.+/, // match all mr-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /p-.+/, // match all m-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /px-.+/, // match all mx-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /py-.+/, // match all my-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /pt-.+/, // match all mt-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /pb-.+/, // match all mb-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /pl-.+/, // match all ml-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /pr-.+/, // match all mr-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /max-w-.+/, // match all max-w-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /max-h-.+/, // match all max-h-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /h-.+/, // match all h-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /w-.+/, // match all w-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /space-.+/, // match all space-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /space-x-.+/, // match all space-x-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /space-y-.+/, // match all space-y-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /flex-.+/, // match all flex-y-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
		{
			pattern: /hidden/, // match all flex-y-*
			variants: ["xs", "sm", "md", "lg", "xl"],
		},
	],
	theme: {
		extend: {
			colors: {
				"base-color": "rgba(var(--text-color-base), 1)",
				"bright-color": "rgba(var(--text-color-base), 1)",
				"brighter-color": "rgba(var(--text-color-brighter), 1)",
				"brightest-color": "rgba(var(--text-color-brightest), 1)",
				background: "rgba(var(--background-color), 1)",
				foreground: "rgba(var(--foreground-color), 1)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
}
export default config

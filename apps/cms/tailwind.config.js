/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./app/(dashboard)/***/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				primary: [
					"silka",
					"-apple-system",
					"BlinkMacSystemFont",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
			colors: {
				slate: {
					DEFAULT: "rgba(var(--slate-400), <alpha-value>)",
					50: "rgba(var(--slate-50), <alpha-value>)",
					100: "rgba(var(--slate-100), <alpha-value>)",
					200: "rgba(var(--slate-200), <alpha-value>)",
					300: "rgba(var(--slate-300), <alpha-value>)",
					400: "rgba(var(--slate-400), <alpha-value>)",
					500: "rgba(var(--slate-500), <alpha-value>)",
					600: "rgba(var(--slate-600), <alpha-value>)",
					700: "rgba(var(--slate-700), <alpha-value>)",
					800: "rgba(var(--slate-800), <alpha-value>)",
					900: "rgba(var(--slate-900), <alpha-value>)",
					950: "rgba(var(--slate-950), <alpha-value>)",
				},
			},
		},
	},
	plugins: [],
}

module.exports = {
	semi: false,
	tabWidth: 4,
	useTabs: false,
	singleQuote: false,
	bracketSpacing: true,
	arrowParens: "avoid",
	jsxBracketSameLine: true,
	jsxSingleQuote: false,
	trailingComma: "none",
	overrides: [
		{
			files: "*.ts",
			options: {
				parser: "typescript",
			},
		},
	],
}

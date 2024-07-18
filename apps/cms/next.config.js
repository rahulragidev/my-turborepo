// const { withHydrationOverlay } = require("@builder.io/react-hydration-overlay/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: false,
	images: {
		remotePatterns: [
			{
				hostname: "admin.onlokus.com",
			},
			{
				hostname: "images.onlokus.com",
			},
			{
				hostname: "imagedelivery.net",
			},
			{
				hostname: "via.placeholder.com",
			},
			{
				hostname: "lokus-test.s3.ap-northeast-1.amazonaws.com",
			},
		],
	},
	// experimental: { appDir: true },
	// {},
}

module.exports = nextConfig

// module.exports = withHydrationOverlay({
//	/**
//	 * Optional: `appRootSelector` is the selector for the root element of your app. By default, it is `#__next` which works
//	 * for Next.js apps with pages directory. If you are using the app directory, you should change this to `main`.
//	 */
//	// appRootSelector: "main",
// })(nextConfig)

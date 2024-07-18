/** @type {import('next').NextConfig} */
const nextConfig = {
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
		],
	},
}

module.exports = nextConfig

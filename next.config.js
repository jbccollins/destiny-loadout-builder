/** @type {import('next').NextConfig} */
const nextConfig = {
	// TODO: make reactStrictMode true and figure out all the side effect stuff
	// References: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function
	reactStrictMode: false,
	swcMinify: true,

	images: {
		unoptimized: true, // TODO: remove this if we ever switch back off of the free tier
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.bungie.net',
			},
		],
	},
};

module.exports = nextConfig;

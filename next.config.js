/** @type {import("next").NextConfig} */
const nextConfig = {
  // TODO: make reactStrictMode true and figure out all the side effect stuff
  // References: https://blog.logrocket.com/understanding-react-useeffect-cleanup-function
  reactStrictMode: false,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bungie.net',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig

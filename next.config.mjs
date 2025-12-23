/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.ombaa.com/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'ombaa.eu',
          },
        ],
      },
    ]
  },
}

export default nextConfig
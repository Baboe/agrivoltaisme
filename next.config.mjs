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
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/directory.html',
        destination: '/directory',
        permanent: true,
      },
      {
        source: '/directory-integrated.html',
        destination: '/directory',
        permanent: true,
      },
      {
        source: '/directory-data.js',
        destination: '/directory',
        permanent: true,
      },
      {
        source: '/blog.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/bretagne.html',
        destination: '/france',
        permanent: true,
      },
      {
        source: '/data_integration_docs.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/multi_country_integration_docs.html',
        destination: '/about',
        permanent: true,
      },
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

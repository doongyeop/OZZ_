/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.msscdn.net',
        port: '',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig

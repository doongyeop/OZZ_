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
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-extra',
      'puppeteer-extra-plugin-stealth',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://i11a804.p.ssafy.io:8080/:path*', // 백엔드 서버 URL
      },
    ]
  },
}

export default nextConfig

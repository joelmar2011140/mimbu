/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      { source: '/', destination: '/edicoes', permanent: true },
      { source: '/dashboard', destination: '/dashboard/edicoes', permanent: true }
    ]
  }
}

module.exports = nextConfig

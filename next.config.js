/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      { source: '/', destination: '/edicoes', permanent: true },
      { source: '/panel', destination: '/panel/admin/edicoes', permanent: true }
    ]
  }
}

module.exports = nextConfig

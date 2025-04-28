/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    if (isServer) {
      const { initServer } = require('./lib/server.js');
      initServer();
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['socket.io'],
  },
  async rewrites() {
    return [
      {
        source: '/api/socket/io',
        destination: 'http://localhost:3001/api/socket/io',
      },
    ]
  },
}

module.exports = nextConfig

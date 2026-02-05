/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  cleanDistDir: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    BACKEND_URL: process.env.BACKEND_URL || 'https://pookie-todo-backend.vercel.app',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

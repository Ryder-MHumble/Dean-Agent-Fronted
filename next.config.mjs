/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turbopack 通过 CLI 控制: 使用 'npm run dev' (Webpack) 或 'npm run dev:turbo' (Turbopack)
}

export default nextConfig

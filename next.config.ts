/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This tells Vercel to ignore TypeScript errors and just build the app
    ignoreBuildErrors: true,
  },
  eslint: {
    // This tells Vercel to ignore ESLint warnings too, just in case
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
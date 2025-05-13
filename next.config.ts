/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // allow Next.js Image optimization from your avatar host
    domains: ["avatar.iran.liara.run"],
  },
  // any other custom config you need…
};

module.exports = nextConfig;

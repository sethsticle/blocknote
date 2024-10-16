/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['page.tsx'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  images: {
    domains: ['via.placeholder.com'], // Add the domain here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;

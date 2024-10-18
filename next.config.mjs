/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['pages'], // Update this to run ESLint on your directories (if needed)
  },
  images: {
    // Remove the deprecated "domains" array
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;

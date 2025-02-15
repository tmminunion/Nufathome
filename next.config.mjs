/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/status",
        destination: "http://192.168.1.9:80/status",
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;

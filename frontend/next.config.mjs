/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "assets.codepen.io",
                protocol: "https",
            },
            {
                hostname: "static.nike.com",
                protocol: "https"
            }
        ]
    }
};

export default nextConfig;
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
            }, 
            {
                hostname: "images.pexels.com",
                protocol: "https"
            },
            {
                hostname: "lottie.host",
                protocol: "https"
            },
            {
                hostname: "res.cloudinary.com",
                protocol: "https"
            },
            {
                hostname: "images.unsplash.com",
                protocol: "https"
            },
            {
                hostname: "tenor.com",
                protocol: "https"
            }
        ]
    },
    webpack(config, { isServer }) {
        if (!isServer) {
          config.devtool = 'source-map'; // Explicitly set source maps for client-side code
        }
        return config;
      }, 
};

export default nextConfig;

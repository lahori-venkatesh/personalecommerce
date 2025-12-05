/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com'], // Common domains, add more as needed
  },
}

module.exports = nextConfig


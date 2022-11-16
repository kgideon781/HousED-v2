/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: [
        'bayut-production.s3.eu-central-1.amazonaws.com', 'images.bayut.com',
        "firebasestorage.googleapis.com"
    ]
  }
}

module.exports = nextConfig

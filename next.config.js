/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'images.ctfassets.net', // Contentful
      'cdn.sanity.io', // Sanity
      'picsum.photos', // Lorem Picsum
      'via.placeholder.com', // Placeholder images
      'placehold.co', // Placeholder images
      'source.unsplash.com', // Unsplash source
      'images.pexels.com', // Pexels
      'cdn.pixabay.com', // Pixabay
      'raw.githubusercontent.com', // GitHub raw content
      'github.com', // GitHub assets
      'avatars.githubusercontent.com', // GitHub avatars
      'i.imgur.com', // Imgur
      'media.giphy.com', // Giphy
      'firebasestorage.googleapis.com', // Firebase Storage
      'storage.googleapis.com', // Google Cloud Storage
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'annonces',
    format: async () => 'webp', // Convertir chaque image en .webp
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`,
  },
});

module.exports = { cloudinary, storage };
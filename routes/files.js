const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { verifyToken } = require('../middleware/auth');
const {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile
} = require('../controllers/filesController');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vps-uploads',
    resource_type: 'auto'
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// All routes require authentication
router.use(verifyToken);

// Upload a file
router.post('/', upload.single('file'), uploadFile);

// Get all files
router.get('/', getFiles);

// Get a specific file info
router.get('/:id', getFileById);

// Delete a file
router.delete('/:id', deleteFile);

module.exports = router;

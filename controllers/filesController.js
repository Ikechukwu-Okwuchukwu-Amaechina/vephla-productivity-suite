const File = require('../models/File');

// Upload a file to Cloudinary
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      cloudinaryUrl: req.file.secure_url || req.file.path,
      cloudinaryPublicId: req.file.public_id || req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      userId: req.user.id
    });

    await file.save();
    return res.status(201).json({ success: true, message: 'File uploaded', file });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
  }
};

// Get all files for the current user
exports.getFiles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const files = await File.find({ userId: req.user.id })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await File.countDocuments({ userId: req.user.id });

    return res.json({
      success: true,
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching files', error: err.message });
  }
};

// Get a single file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    return res.json({ success: true, file });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching file', error: err.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    return res.json({ success: true, message: 'File deleted', file });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting file', error: err.message });
  }
};

// Debug script to test upload functionality
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const { uploadShortVideo, uploadLongVideo } = require('../config/cloudinary');

// Enhanced upload endpoint with better error handling
router.post('/upload/short-debug', auth, uploadShortVideo.single('video'), async (req, res) => {
  try {
    console.log('=== DEBUG UPLOAD START ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No video file provided',
        debug: 'Check if file is being sent with name "video"'
      });
    }

    const { title, description } = req.body;

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Title is required',
        received: { title, description }
      });
    }

    // Create video document
    const videoData = {
      title: title.trim(),
      description: description?.trim() || '',
      url: req.file.path,
      publicId: req.file.filename,
      duration: req.file.duration || 0,
      videoType: 'short',
      size: req.file.size,
      user: req.user.userId,
      thumbnail: req.file.thumbnail_url || ''
    };

    console.log('Creating video with:', videoData);

    const video = new Video(videoData);
    await video.save();

    console.log('Video saved successfully:', video._id);
    
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video: {
        id: video._id,
        title: video.title,
        url: video.url
      }
    });
  } catch (error) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false,
      message: 'Upload failed',
      error: error.message,
      type: error.name
    });
  }
});

module.exports = router;

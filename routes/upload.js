const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const { uploadShortVideo, uploadLongVideo } = require('../config/cloudinary');

// Upload short video (max 50MB)
router.post('/upload/short', auth, uploadShortVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create video document
    const video = new Video({
      title: title.trim(),
      description: description?.trim() || '',
      url: req.file.path, // Cloudinary URL
      thumbnail: req.file.thumbnail_url || req.file.path.replace('/upload/', '/upload/w_640,h_360,c_limit/'),
      duration: req.file.duration || 0,
      videoType: 'short',
      user: req.user.userId,
      size: req.file.size || 0,
      publicId: req.file.filename || '',
      createdAt: new Date()
    });

    await video.save();
    
    // Populate user data before sending response
    await video.populate('user', 'name');
    
    res.status(201).json({
      message: 'Short video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Short video upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

// Upload long video (max 500MB)
router.post('/upload/long', auth, uploadLongVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const { title, description } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create video document
    const video = new Video({
      title: title.trim(),
      description: description?.trim() || '',
      url: req.file.path, // Cloudinary URL
      thumbnail: req.file.thumbnail_url || req.file.path.replace('/upload/', '/upload/w_640,h_360,c_limit/'),
      duration: req.file.duration || 0,
      videoType: 'long',
      user: req.user.userId,
      size: req.file.size || 0,
      publicId: req.file.filename || '',
      createdAt: new Date()
    });

    await video.save();
    
    // Populate user data before sending response
    await video.populate('user', 'name');
    
    res.status(201).json({
      message: 'Long video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Long video upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

// Like/Unlike video
router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user.userId;
    const isLiked = video.likes.includes(userId);

    if (isLiked) {
      // Unlike
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      video.likes.push(userId);
    }

    await video.save();
    
    res.json({
      message: isLiked ? 'Video unliked' : 'Video liked',
      video: {
        ...video.toObject(),
        likes: video.likes
      }
    });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Failed to like video' });
  }
});

// Add view to video
router.post('/:id/view', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user.userId;
    
    // Only add view if user hasn't viewed before
    if (!video.views.includes(userId)) {
      video.views.push(userId);
      await video.save();
    }

    res.json({ 
      message: 'View recorded',
      views: video.views.length
    });
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ message: 'Failed to record view' });
  }
});

module.exports = router;

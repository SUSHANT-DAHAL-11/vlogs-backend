const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');

// GET /api/videos?type=short|long|all
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && req.query.type !== 'all') {
      filter.videoType = req.query.type;
    }
    const videos = await Video.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('user', 'name');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ video });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video' });
  }
});

router.post('/:id/view', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user.userId;

    // Exclude creator's own views from being counted
    if (video.user.toString() === userId) {
      return res.json({
        message: 'Creator views are not counted',
        viewCount: video.views ? video.views.length : 0
      });
    }

    if (!video.views) {
      video.views = [];
    }
    const hasViewed = video.views.some(id => id.toString() === userId);
    if (!hasViewed) {
      video.views.push(userId);
      await video.save();
    }

    res.json({ 
      message: 'View recorded successfully',
      viewCount: video.views.length
    });
  } catch (err) {
    console.error('Error recording view:', err);
    res.status(500).json({ message: 'Failed to record view' });
  }
});

// POST /api/videos/:id/like - Toggle like for authenticated users
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user.userId;
    const isLiked = video.likes.includes(userId);
    
    if (isLiked) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      video.likes.push(userId);
    }
    
    await video.save();
    
    res.json({ 
      video,
      liked: !isLiked,
      likeCount: video.likes.length
    });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

// GET /api/videos/my-videos - get videos uploaded by logged-in user with stats
router.get('/my-videos', authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.userId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // Calculate stats for each video
    const videosWithStats = videos.map(video => ({
      ...video.toObject(),
      viewCount: video.views ? video.views.length : 0,
      likeCount: video.likes ? video.likes.length : 0,
      commentCount: 0 // Placeholder for future comment count
    }));

    // Calculate summary stats
    const totalVideos = videos.length;
    const totalViews = videos.reduce((sum, video) => sum + (video.views ? video.views.length : 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + (video.likes ? video.likes.length : 0), 0);
    const shortVideos = videos.filter(video => video.videoType === 'short').length;
    const longVideos = videos.filter(video => video.videoType === 'long').length;

    res.json({ 
      videos: videosWithStats,
      stats: {
        totalVideos,
        totalViews,
        totalLikes,
        shortVideos,
        longVideos
      }
    });
  } catch (err) {
    console.error('Error fetching my videos:', err);
    res.status(500).json({ message: 'Failed to fetch your videos' });
  }
});

module.exports = router;

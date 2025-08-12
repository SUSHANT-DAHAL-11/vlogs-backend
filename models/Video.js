const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  thumbnail: String,
  duration: { type: Number, default: 0 },
  videoType: { type: String, enum: ['short', 'long'], default: 'short' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who viewed
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who liked
  size: { type: Number, default: 0 },
  publicId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

videoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Video', videoSchema);

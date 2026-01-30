const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', BlogPostSchema);

const express = require('express');

const BlogPost = require('../models/BlogPost');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { initCloudinary, uploadImageBuffer, cloudinary } = require('../utils/cloudinary');

const router = express.Router();

const cloudinaryReady = initCloudinary();

router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to load posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to load post' });
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      if (!cloudinaryReady) {
        return res.status(400).json({ message: 'Cloudinary is not configured but an image was uploaded' });
      }

      const uploaded = await uploadImageBuffer({ buffer: req.file.buffer, mimetype: req.file.mimetype });
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }

    const post = await BlogPost.create({
      title,
      subtitle: subtitle || '',
      content,
      imageUrl,
      imagePublicId,
      author: req.userId,
    });

    const populated = await BlogPost.findById(post._id).populate('author', 'username email');
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to create post' });
  }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.userId)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const { title, subtitle, content } = req.body;
    if (title !== undefined) post.title = title;
    if (subtitle !== undefined) post.subtitle = subtitle;
    if (content !== undefined) post.content = content;

    if (req.file) {
      if (!cloudinaryReady) {
        return res.status(400).json({ message: 'Cloudinary is not configured but an image was uploaded' });
      }

      if (post.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(post.imagePublicId);
        } catch {
          // best-effort cleanup
        }
      }

      const uploaded = await uploadImageBuffer({ buffer: req.file.buffer, mimetype: req.file.mimetype });
      post.imageUrl = uploaded.url;
      post.imagePublicId = uploaded.publicId;
    }

    await post.save();
    const populated = await BlogPost.findById(post._id).populate('author', 'username email');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to update post' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.userId)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (cloudinaryReady && post.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(post.imagePublicId);
      } catch {
        // best-effort
      }
    }

    await post.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to delete post' });
  }
});

module.exports = router;

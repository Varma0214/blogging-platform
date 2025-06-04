const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');


const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log('Uploading file:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG/JPG/PNG images are allowed'));
  },
});


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});


router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const post = new Post({
      title,
      content,
      image: req.file ? `/Uploads/${req.file.filename}` : null,
    });
    await post.save();
    console.log('Created post:', post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});


router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (req.file) {
      
      if (post.image) {
        const oldImagePath = path.join(__dirname, '..', post.image);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Deleted old image:', oldImagePath);
          }
        } catch (fileError) {
          console.error('Error deleting old image:', fileError.message);
        }
      }
      post.image = `/Uploads/${req.file.filename}`;
    }

    await post.save();
    console.log('Updated post:', post._id);
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Deleted image:', imagePath);
        } else {
          console.log('Image not found, skipping deletion:', imagePath);
        }
      } catch (fileError) {
        console.error('Error deleting image:', fileError.message);
      }
    }

    await post.deleteOne();
    console.log('Deleted post:', req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error.message, error.stack);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

module.exports = router;
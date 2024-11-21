const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

router.get('/', async function(req, res, next) {
  const post = await Post.find();
  res.status(200).json({ post });
});

router.post('/', async function(req, res, next) {
  const newPost = await Post.create(req.body);
  res.status(200).json({ 'status': 'success', 'post': newPost });
});

module.exports = router;
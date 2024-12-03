const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

router.get('/', async function(req, res, next) {
  const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const allPosts = await Post.find(q).sort(timeSort);
  
  res.status(200).json({
    'status': 'success',
    'post': allPosts
  });
});

router.post('/', async function(req, res, next) {
  const newPost = await Post.create(req.body);
  res.status(200).json({ 'status': 'success', 'post': newPost });
});

module.exports = router;
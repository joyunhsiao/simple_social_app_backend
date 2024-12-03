const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

router.get('/', async function(req, res, next) {
  const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const allPosts = await Post.find(q).populate({
    path: "user",
    select: "name photo"
  }).sort(timeSort);
  
  res.status(200).json({
    'status': 'success',
    'post': allPosts
  });
});

router.post('/', async function(req, res, next) {
  try{
    const { body } = req;
    const newPost = await Post.create({
      user: body.user,
      content: body.content
    });

    res.status(200).json({
      'status': 'success',
      'post': newPost
    });
  }catch(err){
    res.status(400).json({
      "status": "false",
      "message": err.message
    });
  }
});

module.exports = router;
const Post = require("../models/postModel");

const posts = {
  async getPosts(req, res) {
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
  },
  async createPost(req, res) {
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
  },
};

module.exports = posts;
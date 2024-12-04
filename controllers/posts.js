const { successHandle, errorHandle } = require("../service/responseHandle");
const Post = require("../models/postModel");

const posts = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPosts = await Post.find(q).populate({
      path: "user",
      select: "name photo"
    }).sort(timeSort);
    
    successHandle(res, allPosts);
  },
  async createPost(req, res) {
    try{
      const { body } = req;
      const newPost = await Post.create({
        user: body.user,
        content: body.content
      });
  
      successHandle(res, newPost);
    }catch(err){
      errorHandle(res, err.message);
    }
  },
  async deleteAllPosts(req, res) {
    try{
      await Post.deleteMany({});
      const allPosts = await Post.find().populate({
        path: "user",
        select: "name photo"
      });
      successHandle(res, allPosts);
    }catch(err){
      errorHandle(res, err.message);
    }
  },
  async deleteOnePost(req, res) {
    try{
      const id = req.params.id;
      if (await Post.findById(id) !== null) {
        await Post.findByIdAndDelete(id);
        const allPosts = await Post.find().populate({
          path: "user",
          select: "name photo"
        });
        successHandle(res, allPosts);
      }else{
        errorHandle(res, "No matching record was found.");
      }
    }catch(err){
      errorHandle(res, err.message);
    }
  },
};

module.exports = posts;
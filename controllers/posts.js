const { successHandle, errorHandle } = require("../service/responseHandle");
const Post = require("../models/postModel");
const { getPopulatedPosts } = require("../service/postService");

const posts = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPosts = await getPopulatedPosts(q, timeSort);
    
    successHandle(res, "Post retrieval was successful.", allPosts);
  },
  async createPost(req, res) {
    try{
      const { body } = req;
      const newPost = await Post.create({
        user: body.user,
        content: body.content
      });
  
      successHandle(res, "Post creation was successful.", newPost);
    }catch(err){
      errorHandle(res, err.message);
    }
  },
  async deleteAllPosts(req, res) {
    try{
      await Post.deleteMany({});
      successHandle(res, "All posts have been successfully deleted.");
    }catch(err){
      errorHandle(res, err.message);
    }
  },
  async deleteOnePost(req, res) {
    try{
      const id = req.params.id;
      if (await Post.findById(id) !== null) {
        await Post.findByIdAndDelete(id);
        successHandle(res, "The post has been successfully deleted.");
      }else{
        errorHandle(res, "No matching record was found.");
      }
    }catch(err){
      errorHandle(res, err.message);
    }
  },
  async updatePosts(req, res) {
    try{
      const { body } = req;
      const id = req.param.id;
      if (await Post.findById(id) !== null){
        if(body.content){
          const updatePost = await Post.findByIdAndUpdate(id); // todo
          successHandle(res, "The post has been successfully updated.", updatePost);
        }else{
          errorHandle(res, "Please provide at least a name or content to proceed.");
        }
      }else{
        errorHandle(res, "No matching record was found.");
      }
    }catch(err){
      errorHandle(res, err.message);
    }
  }
};

module.exports = posts;
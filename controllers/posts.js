const responseHandle = require("../service/responseHandle");
const Post = require("../models/postModel");
const { getPopulatedPosts } = require("../service/postService");

const posts = {
  getPosts: responseHandle.errorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
    const allPosts = await getPopulatedPosts(q, timeSort);
    responseHandle.success(res, "Post retrieval was successful.", allPosts);
  }),
  createPost: responseHandle.errorAsync(async (req, res, next) => {
    const { body } = req;
    if (body.content){
      const newPost = await Post.create(body);
      responseHandle.success(res, "Post creation was successful.", newPost);
    }else{
      responseHandle.errorNew(400, "The content of the post is required.", next);
    }
  }),
  deleteAllPosts: responseHandle.errorAsync(async (req, res, next) => {
    if (req.originalUrl === "/posts/") {
      responseHandle.errorNew(404, "No such route found on this server.", next)
    }else{
      await Post.deleteMany({});
      responseHandle.success(res, "All posts have been successfully deleted.", Post);
    }
  }),
  deleteOnePost: responseHandle.errorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (await Post.findById(id) !== null) {
      await Post.findByIdAndDelete(id);
      responseHandle.success(res, "The post has been successfully deleted.", Post);
    }else{
      responseHandle.errorNew(400, "No matching record was found.", next);
    }
  }),
  updatePosts: responseHandle.errorAsync(async (req, res, next) => {
    const { body } = req;
    const id = req.param.id;
    if (await Post.findById(id) !== null){
      if(body.content){
        const updatePost = await Post.findByIdAndUpdate(id); // todo
        responseHandle.success(res, "The post has been successfully updated.", updatePost);
      }else{
        responseHandle.errorNew(400, "Please provide at least a name or content to proceed.", next);
      }
    }else{
      responseHandle.errorNew(400, "No matching record was found.", next);
    }
  })
};

module.exports = posts;
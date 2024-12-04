const Post = require("../models/postModel");

const getPopulatedPosts = async (query = {}, sort = "-createdAt") => {
  return await Post.find(query)
    .populate({
      path: "user",
      select: "name photo"
    })
    .sort(sort);
};

module.exports = { getPopulatedPosts };
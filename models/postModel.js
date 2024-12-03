const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "A User ID must be provided to submit a post."]
    },
    content: {
      type: String,
      required: [true, "Post content must be provided."]
    },
    image: {
      type: String,
      default: ""
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Post  = mongoose.model("posts", postSchema);

module.exports = Post;
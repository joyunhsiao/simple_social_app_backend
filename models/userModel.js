const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required."]
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    email: {
      type: String,
      required: [true, "An email is required."],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, "An password is required."],
      minlength: 8,
      select: false
    },
    photo: {
      type: String,
      default: ""
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
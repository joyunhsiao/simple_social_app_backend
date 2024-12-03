const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required to register."]
    },
    email: {
      type: String,
      required: [true, "An email is required to register"],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
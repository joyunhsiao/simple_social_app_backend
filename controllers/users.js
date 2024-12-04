const User = require("../models/userModel");
const responseHandle = require("../service/responseHandle");

const users = {
  getUsers: responseHandle.errorAsync(async (req, res, next) => {
    const allUsers = await User.find();
    responseHandle.success(res, "Data retrieval was successful.", allUsers)
  })
};

module.exports = users;
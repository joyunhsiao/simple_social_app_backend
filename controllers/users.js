const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/userModel");
const responseHandle = require("../service/responseHandle");
const permission = require("../service/permission");

const users = {
  register: responseHandle.errorAsync(async (req, res, next) => {
    let { name, email, password } = req.body;

    // Has the email been registered?
    if(await User.findOne({ email })){
      return next(responseHandle.errorNew(400, "This email has already been registered.", next));
    }

    // Content cannot be empty.
    if(!name || !email || !password){
      return next(responseHandle.errorNew(400, "Field cannot be empty.", next));
    }

    // Password must be at least 8 characters.
    if(!validator.isLength(password, { min: 8 })){
      return next(responseHandle.errorNew(400, "Password is less than 8 characters.", next));
    }

    // Is it a valid email address?
    if(!validator.isEmail(email)){
      return next(responseHandle.errorNew(400, "Invalid email format.", next));
    }

    // Password encryption.
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      name,
      email,
      password
    });

    permission.generateSendJWT(newUser, 201, res);
  })
};

module.exports = users;
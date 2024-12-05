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
  }),
  login: responseHandle.errorAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
      return next(responseHandle.errorNew(400, "Account and password cannot be empty.", next));
    }

    const user = await User.findOne({ email }).select("+password");
    const auth = bcrypt.compare(password, user.password);
    if(!auth || !user){
      return next(handleResponse.errorNew(400, "Your password is incorrect.", next));
    }

    permission.generateSendJWT(user, 200, res);
  }),
  getUsers: responseHandle.errorAsync(async (req, res, next) => {
    const allUsers = await User.find();
    responseHandle.success(res, "Data retrieval was successful.", allUsers);
  }),
  getUser: responseHandle.errorAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    responseHandle.success(res, "Data retrieval was successful.", user);
  }),
  editUser: responseHandle.errorAsync(async (req, res, next) => {
    if(req.user.id !== req.params.id){
      return responseHandle.errorNew(401, "You do not have permission.", next);
    }else{
      const { name, gender, photo } = req.body;
      const id = req.params.id;
      if(!name){
        return responseHandle.errorNew(400, "Name is not provided.", next);
      }else{
        const editUser = await User.findByIdAndUpdate(id, { name, gender, photo }, { new: true, runValidators: true });
        if(!editUser){
          return responseHandle.errorNew(400, "Edit failed.", next);
        }else{
          const users = await User.find();
          responseHandle.success(res, "Edit was successful", users)
        }
      }
    }
  }),
};

module.exports = users;
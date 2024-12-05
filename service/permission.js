const jwt = require("jsonwebtoken");
const responseHandle = require("../service/responseHandle");
const User = require("../models/userModel");

const permission = {
  isAuth: responseHandle.errorAsync(async (req, res, next) => {
    // Verify if the token exists
    let token;
    if(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
      return next(responseHandle.errorNew(401, "You are not logged in.", next))
    }

    // Validate the token's authenticity
    const decoded = await new Promise((resolve, reject) => {
      // Use the token and process.env.JWT_SECRET to verify the JWT and decrypt it
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
          reject(err)
        }else{
          resolve(payload)
        }
      });
    });

    // Extract the decrypted ID information (user information)
    const currentUser = await User.findById(decoded.id); // Access the database

    // Attach a user property to req and include the user data for later use
    req.user = currentUser;
    next();
  }),
  generateSendJWT: (user, statusCode, res) => {
    // Generate a JWT token
    const token = jwt.sign( // Create a signature
      { id: user.id }, // Specify the payload data to include, e.g., name and ID (avoid including email or password)
      process.env.JWT_SECRET, // A string used for obfuscation
      { expiresIn: process.env.JWT_EXPIRES_TIME } // Custom options, such as setting the expiration time
    );

    // Clear the user's password data to prevent accidentally storing it in the database
    user.password = undefined;

    // Send the token (key, signature) to the recipient
    res.status(statusCode).json({
      status: "success",
      user: {
        token,
        name: user.name // Prevent storing the entire user object with the password in the database by mistake; absolutely avoid this
      }
    });
  }
};

module.exports = permission;

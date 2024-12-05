// Environment Configuration
const dotenv = require("dotenv");
dotenv.config({path: "./.env"});

// Mongoose
const mongoose = require("mongoose");

const DB = process.env.DB_PATH.replace(
  "<DB_USERNAME>", process.env.DB_USERNAME
).replace(
  "<DB_PASSWORD>", process.env.DB_PASSWORD
).replace(
  "<DB_NAME>", process.env.DB_NAME
)

mongoose.connect(DB)
  .then(
    () => { console.log("success") },
  )
  .catch(
    error => { console.log("error", error.reason) }
  );

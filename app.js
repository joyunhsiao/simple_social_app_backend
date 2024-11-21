// Express definitions
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Environment Configuration
const dotenv = require("dotenv");
dotenv.config({path: "./.env"});

// Mongoose
const mongoose = require('mongoose');

const DB = process.env.DB_PATH.replace(
  "<DB_USERNAME>", process.env.DB_USERNAME
).replace(
  "<DB_PASSWORD>", process.env.DB_PASSWORD
).replace(
  "<DB_NAME>", process.env.DB_NAME
)

mongoose.connect(DB)
  .then(
    () => {console.log("success")},
    error => {console.log("error", error.reason)}
  );

// Express App Initialization
var app = express();

// cors
const cors = require('cors');
app.use(cors());

// Express main content
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

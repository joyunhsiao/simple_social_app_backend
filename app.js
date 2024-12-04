// Express definitions
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
const responseHandle = require('./service/responseHandle');

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

// connections
require("./connections");

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
app.use('/posts', postsRouter);

app.use(function(err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    return responseHandle.errorDev(err, res);
  }

  // production
  if (err.name === "ValidationError") {
    err.message = "The data field is not filled out correctly, please enter it again.";
    err.isOperational = true;
    return responseHandle.errorProd(err, res);
  }
  responseHandle.errorProd(err, res);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Uncaught rejection: ", promise, "Reason: ", reason);
  // Logged in the log file.
});
process.on('uncaughtException', reason => {
  // The error is logged, and the process will be terminated once all services have been processed.
  console.error('Uncaught Exception!')
  console.error(reason);
  console.error(reason.name); // ReferenceError
  console.error(reason.message); // thisCauseAnError is not defined
  console.error(reason.stack); // ReferenceError: thisCauseAnError is not defined ......
  process.exit(1);
});

module.exports = app;

const responseHandle = {
  success: (res, message, data) => {
    res.status(200).json({
      "status": "success",
      "message": message,
      "data": data
    });
  },
  errorAsync: (func) => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  },
  errorNew: (httpStatus, message, next) => {
    const error = new Error(message);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
  },
  errorProd: (error, res) => {
    if (error.isOperational) {
      res.status(error.statusCode).send({
        "message": error.message
      })
    }else{
      console.error("An unexpected error has occurred.", error);
      res.status(500).json({
        "status": "error",
        "message": "A system error has occurred. Please contact the system administrator for assistance."
      })
    }
  },
  errorDev: (error, res) => {
    res.status(error.statusCode).send({
      "message": error.message,
      "error": error,
      "stack": error.stack
    })
  }
};

module.exports = responseHandle;
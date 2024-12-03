const successHandle = (res, data) => {
  res.status(200).json({
    'status': 'success',
    'post': data
  });
};

const errorHandle = (res, message) => {
  res.status(400).json({
    "status": "false",
    "message": message
  });
};

module.exports = { successHandle, errorHandle };
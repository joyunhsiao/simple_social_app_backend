const responseHandle = require("../service/responseHandle");
const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");

const uploadFiles = {
  uploadImg: responseHandle.errorAsync(async(req, res, next) => {
    if(!req.files.length) {
      return next(responseHandle.errorNew(400, "File not uploaded yet", next));
    }
    const dimensions = sizeOf(req.files[0].buffer);
    if(dimensions.width !== dimensions.height) {
      return next(responseHandle.errorNew(400, "Image width and height do not meet the 1:1 ratio requirement", next));
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
  });
    responseHandle.success(res, "The image has been uploaded successfully.", response.data.link)
  })
};

module.exports = uploadFiles;
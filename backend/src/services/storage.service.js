const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVET_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(base64File, fileName) {
  return imagekit.files.upload({
    file: base64File,
    fileName,
    folder: "/foods",
  });
}

module.exports = { uploadFile };

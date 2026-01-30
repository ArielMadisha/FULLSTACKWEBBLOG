const cloudinary = require('cloudinary').v2;

function initCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // Allow running without Cloudinary (image becomes optional)
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return true;
}

async function uploadImageBuffer({ buffer, mimetype }) {
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64}`;

  const folder = process.env.CLOUDINARY_FOLDER || 'fullstackwebblog';
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

module.exports = { cloudinary, initCloudinary, uploadImageBuffer };

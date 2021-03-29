const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'djploevtk',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadFile = async (file) => {
    const result = await cloudinary.uploader.upload(file)
    return result
}

module.exports = {
    uploadFile
}
import cloudinary from '../utils/cloudinary'

export const deleteImage = async (publicId) => {
  try {
    // Delete the image
    const result = await cloudinary.v2.uploader.destroy(publicId)

    // Return the result
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

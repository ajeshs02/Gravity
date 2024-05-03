import { createReadStream } from 'streamifier'
import cloudinary from '../utils/cloudinary.js'

// product images
const uploadMiddleware = (req, res, next) => {
  if (!req.files) {
    return next()
  }

  let counter = 0
  req.files.forEach((file) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      function (error, result) {
        if (error) {
          return next(error)
        }

        // Store the URL and public_id
        file.url = result.url
        file.public_id = result.public_id
        counter++

        if (counter === req.files.length) {
          next()
        }
      }
    )

    createReadStream(file.buffer).pipe(cld_upload_stream)
  })
}

// user profile image
const userUploadMiddleware = (req, res, next) => {
  if (!req.file) {
    return next()
  }

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    { folder: 'users' },
    function (error, result) {
      if (error) {
        return next(error)
      }

      // Store the URL and public_id
      req.file.url = result.url
      req.file.public_id = result.public_id

      next()
    }
  )

  createReadStream(req.file.buffer).pipe(cld_upload_stream)
}

// store profile image
const storeUploadMiddleware = (req, res, next) => {
  if (!req.file) {
    return next()
  }

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    { folder: 'stores' },
    function (error, result) {
      if (error) {
        return next(error)
      }

      req.file.url = result.url
      req.file.public_id = result.public_id

      next()
    }
  )

  createReadStream(req.file.buffer).pipe(cld_upload_stream)
}

//product image update
const productUploadMiddleware = (req, res, next) => {
  if (!req.file) {
    return next()
  }

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    { folder: 'products' },
    function (error, result) {
      if (error) {
        return next(error)
      }

      // Store the URL and public_id
      req.file.url = result.url
      req.file.public_id = result.public_id

      next()
    }
  )

  createReadStream(req.file.buffer).pipe(cld_upload_stream)
}

export {
  uploadMiddleware,
  userUploadMiddleware,
  storeUploadMiddleware,
  productUploadMiddleware,
}

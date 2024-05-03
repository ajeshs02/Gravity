import OTP from '../../models/otpModel.js'
import Store from '../../models/storeModel.js'
import { generateToken } from '../../utils/generateToken.js'
import { handleError } from '../../utils/handleError.js'
import otpGenerator from 'otp-generator'
import Product from '../../models/productModel.js'
import Follower from '../../models/followersModel.js'

//@desc Send OTP before Store Registration
//@route POST/api/store/send-otp
//@access Public
const sendOTP = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Email is mandatory', success: false })
  }
  try {
    const existingStore = await Store.findOne({ email })
    if (existingStore) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'StoreEmailInUse',
          message: 'Store Email already in use',
        },
      })
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    let existingOTP = await OTP.findOne({ email, otp })

    while (existingOTP) {
      // If the generated OTP already exists for the given email, regenerate a new one
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      existingOTP = await OTP.findOne({ email, otp })
    }

    const otpBody = await OTP.create({ email, otp })

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: otpBody,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc Verify OTP and Store Registration
//@route POST/api/store/register
//@access Public
const registerStore = async (req, res) => {
  const { name, email, password, mobile, description, otp } = req.body

  try {
    const existingStore = await Store.findOne({ email })
    if (existingStore) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'StoreEmailInUse',
          message: 'Store Email already in use',
        },
      })
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)

    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'InvalidOTP',
          message: 'Expired or invalid OTP.',
        },
      })
    }

    const store = await Store.create({
      storeName: name,
      email,
      password,
      mobile,
      description,
    })

    const storeWithoutPassword = {
      id: store._id,
      name: store.storeName,
      image: store.image,
      email: store.email,
      mobile: store.mobile,
      description: store.description,
      paymentMethod: store.paymentMethod,
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified and Store registered successfully',
      user: storeWithoutPassword,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc   Store Login
//@route  POST/api/stores/login
//@access Public
const loginStore = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  try {
    const store = await Store.findOne({ email }).select('+password')

    console.log('store login', store)

    if (store && store.isBlocked) {
      res.status(401).json({
        success: false,
        error: {
          type: 'AccountBlocked',
          message: 'This Store is temporarily blocked by the Admin',
        },
      })
      return
    }

    // console.log(user, email, password)
    if (store && (await store.matchPassword(password))) {
      const token = generateToken(store._id)
      res.cookie('storeToken', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      const storeWithoutPassword = {
        id: store._id,
        storeName: store.storeName,
        email: store.email,
        image: store.image,
        description: store.description,
      }

      res.status(201).json({
        message: 'user logged in successfully',
        success: true,
        store: storeWithoutPassword,
      })
    } else {
      res.status(401).json({
        success: false,
        error: {
          type: 'InvalidCredentials',
          message: 'Invalid email or password.',
        },
      })
    }
  } catch (error) {
    handleError(error)
  }
}

const logoutStore = async (req, res) => {
  res.cookie('store_token', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ success: true, message: 'Log out successful' })
}

//@desc Fetch Store Profile
//@route GET /api/v1/store/profile
//@access private
const fetchStoreProfile = async (req, res) => {
  const storeId = req.store.id

  try {
    let query = { _id: storeId }

    const store = await Store.findOne(query)

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      })
    }

    const totalFollowers = await Follower.countDocuments({ store: storeId })

    const storeWithFollowers = { ...store.toObject(), totalFollowers }

    return res.status(200).json({
      success: true,
      message: 'Store profile fetched successfully.',
      store: storeWithFollowers,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Fetch Products from a Particular Store
//@route GET /api/v1/store/products
//@access public
const fetchStoreProducts = async (req, res) => {
  const storeId = req.store.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8

  if (!storeId) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required to fetch products.',
    })
  }

  try {
    let query = { storeId, softDelete: false }

    const totalProducts = await Product.countDocuments({
      query,
    })

    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)

    return res.status(200).json({
      success: true,
      message: 'Store products fetched successfully',
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}

//@desc Update user profile
//@route PUT/api/v1/user/profile
//@access Private
const updateStoreProfile = async (req, res) => {
  const storeId = req.store.id
  const { name, description, mobile } = req.body

  try {
    const updatedStore = await Store.findOneAndUpdate(
      { _id: storeId },
      { $set: { storeName: name, description, mobile } },
      { new: true }
    )

    if (!updatedStore) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Store profile updated successfully',
      store: updatedStore,
    })
  } catch (error) {
    console.error('Error updating store profile:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating store profile',
    })
  }
}

//@desc Update Store Profile Image
//@route PUT/api/v1/store/update-profile-image
//@access Private
const updateStoreProfileImg = async (req, res) => {
  const storeId = req.store.id

  if (!req.file) {
    return res.status(400).json({ error: 'Profile image is required' })
  }

  try {
    const store = await Store.findById(storeId)
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'store not found',
      })
    }

    store.image = {}

    // If the user already has a profile image, delete it from Cloudinary
    try {
      if (store.image.public_id) {
        await cloudinary.uploader.destroy(store.image.public_id)
      }
    } catch (error) {
      console.log('try catch cloudinary.uploader.destroy failed')
      console.error(error)
    }

    // Update the user's profile image URL and public_id
    await Store.updateOne(
      { _id: storeId },
      {
        $set: {
          'image.url': req.file.url,
          'image.public_id': req.file.public_id,
        },
      }
    )

    const updatedStore = await Store.findById(storeId)

    return res.status(200).json({
      success: true,
      message: 'Store Profile image updated successfully',
      store: updatedStore,
    })
  } catch (error) {
    console.error('Error updating store profile image:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile image',
    })
  }
}

export {
  sendOTP,
  registerStore,
  loginStore,
  logoutStore,
  fetchStoreProfile,
  fetchStoreProducts,
  updateStoreProfileImg,
  updateStoreProfile,
}

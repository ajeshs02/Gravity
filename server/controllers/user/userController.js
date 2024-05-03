import OTP from '../../models/otpModel.js'
import User from '../../models/userModel.js'
import { generateToken } from '../../utils/generateToken.js'
import { handleError } from '../../utils/handleError.js'
import otpGenerator from 'otp-generator'
import cloudinary from '../../utils/cloudinary.js'
import Wishlist from '../../models/wishlistModel.js'

//@desc Send OTP before user Registration
//@route POST/api/user/send-otp
//@access Public
const sendOTP = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ message: 'Email is mandatory', success: false })
  }
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'EmailInUse',
          message: 'Email already in use',
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

//@desc Verify OTP and User Registration
//@route POST/api/user/register
//@access Public
const registerUser = async (req, res) => {
  const { name, email, password, mobile, otp } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'EmailInUse',
          message: 'Email already in use',
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

    const user = await User.create({
      name,
      email,
      password,
      mobile,
    })

    await Wishlist.create({ user: user._id, products: [] })

    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      image: user.image,
      email: user.email,
      mobile: user.mobile,
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified and User registered successfully',
      user: userWithoutPassword,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc User Login
//@route POST/api/user/login
//@access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  try {
    const user = await User.findOne({ email }).select('+password')

    // console.log('user: ', user)
    if (user && user.isBlocked) {
      res.status(401).json({
        success: false,
        error: {
          type: 'AccountBlocked',
          message: 'This Account is temporarily blocked by the Admin',
        },
      })
      return
    }

    // console.log(user, email, password)
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      const userWithoutPassword = {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }

      res.status(201).json({
        message: 'user logged in successfully',
        success: true,
        user: userWithoutPassword,
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

// @desc   Logout user
// route   POST/api/user/logout
// @access Private
const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })

    res.status(200).json({ success: true, message: 'Log out successful' })
  } catch (error) {
    handleError(error)
  }
}

//@desc Get user profile
//@route GET/api/v1/user/profile
//@access Private
const getProfile = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await User.findById(userId)
    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      user,
    })
  } catch (error) {
    console.error('Error fetching  profile:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile',
    })
  }
}

//@desc Update User Profile Image
//@route PUT/api/v1/user/update-profile-image
//@access Private
const updateUserProfileImg = async (req, res) => {
  const userId = req.user.id

  if (!req.file) {
    return res.status(400).json({ error: 'Profile image is required' })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    user.image = {}

    // If the user already has a profile image, delete it from Cloudinary
    try {
      if (user.image.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id)
      }
    } catch (error) {
      console.log('try catch cloudinary.uploader.destroy failed')
      console.error(error)
    }

    // Update the user's profile image URL and public_id
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          'image.url': req.file.url,
          'image.public_id': req.file.public_id,
        },
      }
    )

    const updatedUser = await User.findById(userId)

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating profile image:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile image',
    })
  }
}

//@desc Update user profile
//@route PUT/api/v1/user/profile
//@access Private
const updateUserProfile = async (req, res) => {
  const userId = req.user.id
  const { name, mobile } = req.body

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { name: name, mobile: mobile } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile',
    })
  }
}

//@desc Forgot password
//@route POST/api/v1/users/forgot-password
//@access Private
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .json({ message: 'email not found', success: false })
    }

    const resetToken = generateRandomString()
    user.resetToken = resetToken
    user.resetTokenExp = Date.now() + 1000 * 6 * 10

    await user.save()
    await passwordResetTokenMail(resetToken, email)
    res
      .status(200)
      .json({ resetToken, message: 'Password reset token sent', success: true })
  } catch (error) {
    console.error('Error generating reset token', error)
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    })
  }
}

//@desc Verify token and Reset Password
//@route POST/api/v1/users/reset-password
//@access Private
const resetPassword = async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body

    // console.log(newPassword, resetToken)

    const user = await User.findOne({
      resetToken,
      resetTokenExp: { $gt: Date.now() },
    })
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired reset token', success: false })
    }
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(newPassword, salt)

    user.password = encryptedPassword
    user.resetToken = null
    user.resetTokenExp = null
    await user.save()

    // console.log(user)

    res
      .status(200)
      .json({ success: true, message: 'password reset successfully' })
  } catch (error) {
    console.error('error resetting password', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export {
  registerUser,
  sendOTP,
  loginUser,
  logoutUser,
  getProfile,
  updateUserProfileImg,
  updateUserProfile,
}

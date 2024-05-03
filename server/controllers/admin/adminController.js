import User from '../../models/userModel.js'
import { generateToken } from '../../utils/generateToken.js'
import { handleError } from '../../utils/handleError.js'

//@desc Admin Login
//@route POST/api/v1/admin/login
//@access Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'All fields are mandatory', success: false })
  }

  try {
    const admin = await User.findOne({ email }).select('+password')

    if (admin.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: {
          type: 'UnauthorizedAccess',
          message: 'Invalid credentials',
        },
      })
      return
    }

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id)
      res.cookie('adminToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      const adminWithoutPassword = {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true,
      }

      res.status(201).json({
        message: 'Admin logged in successfully',
        success: true,
        admin: adminWithoutPassword,
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

// @desc   Logout Admin
// route   POST/api/admin/logout
// @access Public
const adminLogout = async (req, res) => {
  try {
    res.cookie('adminToken', '', {
      httpOnly: true,
      expires: new Date(0),
    })

    res.status(200).json({ success: true, message: 'Log out successful' })
  } catch (error) {
    handleError(error)
  }
}

export { adminLogin, adminLogout }

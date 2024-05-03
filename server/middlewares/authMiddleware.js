import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Store from '../models/storeModel.js'

const validateUserToken = async (req, res, next) => {
  let token

  token = req.cookies.token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY)

      req.user = await User.findById(decoded.id)

      // Check if the user is blocked
      if (req.user.isBlocked) {
        res.status(401).json({
          success: false,
          error: {
            type: 'AccountBlocked',
            message: 'Account is blocked',
          },
        })
        return // End the function execution here
      }

      next()
    } catch (error) {
      res.status(401).json({ message: 'Token not valid', success: false })
    }
  } else {
    res.status(401)
    return next(new Error('Not authorized, no token'))
  }
}

// STORE AUTHENTICATION
const validateStoreToken = async (req, res, next) => {
  let token

  token = req.cookies.storeToken
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY)

      req.store = await Store.findById(decoded.id)

      // Check if the store is blocked
      if (req.store.isBlocked) {
        res.status(401).json({
          success: false,
          error: {
            type: 'StoreBlocked',
            message: 'Store is blocked',
          },
        })
        return
      }

      next()
    } catch (error) {
      res.status(401).json({ message: 'Token not valid', success: false })
    }
  } else {
    res.status(401).json({
      success: false,
      error: {
        type: 'Unauthorized',
        message: 'Store not authorized, no token',
      },
    })
  }
}

// ADMIN AUTHENTICATION
const isAdmin = async (req, res, next) => {
  let token

  token = req.cookies.adminToken

  // console.log(token)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY)

      req.user = await User.findById(decoded.id)
      if (req.user.isAdmin) {
        next()
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
      return res
        .status(401)
        .json({ message: 'Token not valid', success: false })
    }
  } else {
    return res
      .status(401)
      .json({ message: 'Admin not authorized, no token', success: false })
  }
}

export { validateUserToken, validateStoreToken, isAdmin }

import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_KEY, {
    expiresIn: 7 * 24 * 60 * 60,
  })
}

export { generateToken }

import jwt from 'jsonwebtoken'

const signToken = obj => {
  const secret = process.env.SECRET
  try {
    const token = jwt.sign(obj, secret, { expiresIn: 60 * 60 * 24 })
    return token
  } catch (err) {
    throw new Error(err.message)
  }
}

const verifyToken = token => {
  const secret = process.env.SECRET
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (err) {
    throw new Error(err.message)
  }
}

export { signToken, verifyToken }

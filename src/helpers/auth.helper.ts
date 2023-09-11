import { EnRole, User } from '@prisma/client'
import { TOKEN_EXPIRED_AT } from 'src/config'
import jwt from 'jsonwebtoken'

export const getAdapterUserFromUser = (user: User) => {
  return {
    id: String(user.id),
    email: user.email,
    username: user.username,
    emailVerified: null,
    role: user.role,
    image: user.image,
    isAdult: user.isAdult,
  }
}

export const createAccessToken = async (data: {
  sub: number
  role: EnRole
}) => {
  const token = jwt.sign(data, process.env.JWT_SECRET || '', {
    expiresIn: TOKEN_EXPIRED_AT,
  })
  return token
}

import { EnAccountProvider, EnRole, EnUserStatus } from '@prisma/client'
import {
  createAccessToken,
  getAdapterUserFromUser,
} from 'src/helpers/auth.helper'
import { prisma } from 'src/instances/prisma'
import { AdapterAccount } from 'next-auth/adapters'
import dayjs from 'dayjs'
import { generateToken } from 'src/helpers/common.helper'

import { UserService } from 'src/services/user.service'

export default function AuthAdapter(): any {
  return {
    async createUser(data: any) {
      const username = await UserService.getUsername(data.name || null)

      const user = await prisma.user.create({
        data: {
          email: data.email,
          username,
          status: EnUserStatus.ACTIVE,
        },
      })
      const accessToken = await createAccessToken({
        sub: user.id,
        role: user.role,
      })
      const image = await UserService.uploadImage(data.image || null, user.id)

      return {
        ...getAdapterUserFromUser(user),
        image,
        accessToken,
      }
    },
    // need to implement for strategy database
    async updateUser(user: any) {
      return {
        id: user.id || '',
        email: user.email || '',
        image: user.image || '',
        username: '',
        emailVerified: user.emailVerified || null,
        role: EnRole.USER,
        name: '',
      }
    },
    async getUser(id: string) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
      })

      if (!user) {
        return null
      }
      return getAdapterUserFromUser(user)
    },
    // need to implement for database strategy
    getSessionAndUser() {
      return null
    },
    async getUserByEmail(email: string) {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return null
      }
      return getAdapterUserFromUser(user)
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string
      provider: string
    }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: provider.toUpperCase() as unknown as EnAccountProvider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account || !account.user) {
        return null
      }
      return getAdapterUserFromUser(account.user)
    },
    async linkAccount(data: AdapterAccount) {
      const account = await prisma.account.create({
        data: {
          userId: parseInt(data.userId, 10),
          provider: data.provider.toUpperCase() as EnAccountProvider,
          providerAccountId: data.providerAccountId,
          accessToken: data.access_token,
          accessTokenExpiredAt: data.expires_at
            ? dayjs(data.expires_at * 1000).toDate()
            : null,
        },
      })
      return account ? data : null
    },
    // need to implement for strategy database
    async createSession(data: any) {
      return data
    },
    // need to implement for strategy database
    async updateSession() {
      return {
        userId: '',
        expires: new Date(),
        sessionToken: generateToken(36),
      }
    },
    // need to implement for strategy database
    async deleteSession() {
      return null
    },
  }
}

import NextAuth, { NextAuthOptions } from 'next-auth'
import VkProvider from 'next-auth/providers/vk'
import GoogleProvider from 'next-auth/providers/google'
import AuthAdapter from 'src/libs/AuthAdapter'
import { TOKEN_EXPIRED_AT } from 'src/config'
import { createAccessToken } from 'src/helpers/auth.helper'

export const authOptions: NextAuthOptions = {
  adapter: AuthAdapter(),
  theme: {
    colorScheme: 'dark',
  },
  providers: [
    VkProvider({
      clientId: process.env.VK_ID || '',
      clientSecret: process.env.VK_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: TOKEN_EXPIRED_AT,
  },
  jwt: {
    maxAge: TOKEN_EXPIRED_AT,
  },
  // logger: {
  // 	error(code, metadata) {
  // 		console.log('t', metadata);
  // 	},
  // 	debug(code, metadata) {
  // 		console.log('t2', metadata);
  // 	}
  // },
  pages: {
    signIn: '/auth/signin', // page for errors from callbacks
  },
  callbacks: {
    async session(data) {
      return {
        expires: data.session.expires,
        user: data.token.user,
      }
    },
    async signIn() {
      return true
      // if (!profile?.email_verified) {
      //   return '/auth/signin?error=EmailVerified'
      // }
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update' && session) {
        token.user = session.user
      }

      // after login creating session with token
      if (user) {
        token.name = user.name
        token.user = {
          id: +user.id,
          email: user.email || '',
          username: user.username,
          image: user.image || '',
          role: user.role,
          isAdult: user.isAdult,
          accessToken:
            user.accessToken ??
            (await createAccessToken({
              sub: +user.id,
              role: user.role,
            })),
        }
      }
      return token
    },
  },
}

export default NextAuth(authOptions)

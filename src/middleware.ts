import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales: ['ru'],
    defaultLocale: 'ru',
  })
  const response = handleI18nRouting(request)

  if (
    process.env.NEXT_PUBLIC_ENV_IS_MAINTENANCE === 'true' &&
    request.nextUrl.pathname !== '/maintenance'
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url), 302)
  }

  if (
    process.env.NEXT_PUBLIC_ENV_IS_MAINTENANCE !== 'true' &&
    request.nextUrl.pathname === '/maintenance'
  ) {
    return NextResponse.redirect(new URL('/', request.url), 302)
  }

  // https://nextjs.org/docs/pages/api-reference/functions/next-server#nextrequest

  // // Step 3: Alter the response

  return response
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}

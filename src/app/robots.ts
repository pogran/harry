import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_ENV_DOMAIN

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api*', '/_next*', '/user*', '/search*', '/admin'],
    },
    host: domain,
    sitemap: `${domain}/sitemap.xml`,
  }
}

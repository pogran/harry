/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ENV_IS_HENTAI: string
    NEXT_PUBLIC_ENV_IS_MAINTENANCE: string
    NEXT_PUBLIC_ENV_MEDIA_DOMAIN: string
    NEXT_PUBLIC_ENV_BACKEND_DOMAIN: string
    NEXT_PUBLIC_ENV_DOMAIN: string
    NEXT_PUBLIC_ENV_APP_NAME: string
    NEXT_PUBLIC_ENV_YANDEX_METRICS_ID: string
    NEXT_PUBLIC_ENV_GOOGLE_ANALYTICS_ID: string
    NEXT_PUBLIC_ENV_DOMAIN: string
    NEXT_PUBLIC_ENV_VAPID_PUBLIC_KEY: string
    NEXT_PUBLIC_ENV_SITE_NAME: string

    DATABASE_URL: string
    VK_ID: string
    VK_SECRET: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
    JWT_SECRET: string
    NEXTAUTH_URL: string
  }
}

interface Window {
  ym(id: number, type: 'hit', url: string): void
  gtag(type: string, id: string, options: { page_path: string }): void
}

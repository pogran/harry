/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'service-worker.js',
})

const withNextIntl = require('next-intl/plugin')('./i18n.ts')

module.exports = withNextIntl(
  withPWA({
    // webpack(config) {
    //   config.infrastructureLogging = { debug: /PackFileCache/ }
    //   return config;
    // },
    images: {
      formats: ['image/webp'],
      domains: [
        'xn--80afhl4affaesa.xn--80asehdb',
        'xn--80aai8agdhw.xn--p1ai',
        'mc.yandex.ru',
        'localhost',
      ],
    },
    reactStrictMode: true,
    swcMinify: true,
  }),
)

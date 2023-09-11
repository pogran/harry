import { JwtUser } from 'types/next-auth'
import { isHentai } from './main.helper'

export const getImageExtByMimeType = (mimeType: string) => {
  switch (mimeType) {
    case 'image/gif':
      return 'gif'

    case 'image/jpeg':
      return 'jpeg'

    case 'image/png':
      return 'png'

    case 'image/webp':
      return 'webp'

    default:
      return ''
  }
}

export const getImageSrc = (link: string) => {
  if (link.includes('https://') || link.includes('http://')) {
    return link
  }
  return `${process.env.NEXT_PUBLIC_ENV_MEDIA_DOMAIN}${link}`
}

export const isBlurImage = (user?: JwtUser) => {
  if (!isHentai()) {
    return false
  }

  if (user?.isAdult === null) {
    return true
  }

  return !user?.isAdult
}

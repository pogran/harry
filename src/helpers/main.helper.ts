import { Session } from 'next-auth'

export const isHentai = () => {
  return process.env.NEXT_PUBLIC_ENV_IS_HENTAI === 'true'
}

export const isMobile = (header: string) => {
  return header.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  )
}

export const imageIsAvailable = (isAuth: boolean) => {
  if (!isHentai()) {
    return true
  }
}

export const contentIsAvailable = (session: Session) => {
  if (!isHentai()) {
    return true
  }
}

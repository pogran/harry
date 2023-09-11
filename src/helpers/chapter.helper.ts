export const getChapterUrl = (bookSlug: string, chapterId: number) => {
  return `${process.env.NEXT_PUBLIC_ENV_DOMAIN}/books/${bookSlug}/ch${chapterId}`
}

export const getSlideUrl = (link: string) => {
  return `${process.env.NEXT_PUBLIC_ENV_MEDIA_DOMAIN}/${link}`
}

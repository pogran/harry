'server only'

// cspell: ignore ldquo,rdquo

export const getBookTitleMeta = async (
  ruTitle: string | null,
  titleEn: string | null,
) => {
  const title = ruTitle ? ruTitle : ''
  if (!titleEn) {
    return title
  }
  return title ? `${title} | ${titleEn}` : titleEn
}

export const getBookDescMeta = async (params: {
  title: string
  desc: string | null
  robotDesc: string | null
}) => {
  const { title, robotDesc } = params
  let desc = params.desc

  let metaDesc = robotDesc ? `${title} ${robotDesc}` : title

  // FIXME: create reg for it
  desc = desc
    ? desc
        .replace(/(<\/?(?:span|div)[^>]*>)|<[^>]+>/gi, '$1')
        .replace(/&nbsp;/g, ' ')
        .replace(/&ldquo;/g, '')
        .replace(/&amp;/g, '')
        .replace(/\s(?=(\n|\r|\r\n))/g, '')
        .replace(/&quot;/g, '')
        .replace(/&rdquo;/g, '')
        .trim()
    : ''

  metaDesc = metaDesc + '. ' + desc
  if (metaDesc.length > 350) {
    metaDesc = metaDesc.slice(0, 350) + '...'
  }
  return metaDesc
}

export const getBookUrlMeta = (slug: string) => {
  return `${process.env.NEXT_PUBLIC_ENV_DOMAIN}/books/${slug}`
}

export const getCatalogUrlMeta = () => {
  return `${process.env.NEXT_PUBLIC_ENV_DOMAIN}/books`
}

export const getChapterUrlMeta = (bookSlug: string, chapterId: number) => {
  return `${process.env.NEXT_PUBLIC_ENV_DOMAIN}/books/${bookSlug}/ch${chapterId}`
}

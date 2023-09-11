import { getCookie, setCookie } from 'cookies-next'
import { EnChapterSetting } from 'src/enums'
import { defaultChaperSettings } from './default-chapter-settings'

export const changeChapterSetting = (
  name: EnChapterSetting,
  value: string | number,
) => {
  const settings = getCookie('chapterSettings')

  if (!settings) {
    return setCookie(
      'chapterSettings',
      JSON.stringify({ ...defaultChaperSettings, [name]: value }),
    )
  }

  return setCookie(
    'chapterSettings',
    JSON.stringify({
      ...JSON.parse(String(settings)),
      [name]: value,
    }),
  )
}

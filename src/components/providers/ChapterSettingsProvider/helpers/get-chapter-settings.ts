import { IntChapterSettings } from '../types'
import { defaultChaperSettings } from './default-chapter-settings'

export const getChapterSettings = (
  cookieSettings: string | null,
): IntChapterSettings => {
  return cookieSettings
    ? {
        ...defaultChaperSettings,
        ...JSON.parse(cookieSettings),
      }
    : defaultChaperSettings
}

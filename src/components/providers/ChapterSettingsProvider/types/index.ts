import { EnChapterSetting } from 'src/enums'

export interface IntChapterSettings {
  width: number
}

export interface IntContext {
  chapterSettings: IntChapterSettings
  changeChapterSetting: (name: EnChapterSetting, value: number) => void
}

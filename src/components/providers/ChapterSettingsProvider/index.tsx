'use client'

import { createContext, useState } from 'react'
import { EnChapterSetting } from 'src/enums'
import { defaultChaperSettings, changeChapterSetting } from './helpers'
import { IntChapterSettings, IntContext } from './types'

export const ChapterSettingsContext = createContext<IntContext>({
  chapterSettings: defaultChaperSettings,
  changeChapterSetting: (name: EnChapterSetting, value: number) => {},
})

export default function ChapterSettingsProvider(props: {
  children: React.ReactNode
  settings: IntChapterSettings
}) {
  const { children, settings } = props

  const [chapterSettings, setChapterSettings] =
    useState<IntChapterSettings>(settings)

  return (
    <ChapterSettingsContext.Provider
      value={{
        chapterSettings,
        changeChapterSetting: (name, value) => {
          setChapterSettings({ ...chapterSettings, [name]: value })
          changeChapterSetting(name, value)
        },
      }}
    >
      {children}
    </ChapterSettingsContext.Provider>
  )
}

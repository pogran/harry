'use client'

import { createContext, useState } from 'react'
import { EnMenuItem } from 'src/enums'
import { IntContext } from './types'

export const ChapterContext = createContext<IntContext>({
  activeMenuItem: null,
  setActiveMenuItem: (item: EnMenuItem | null) => {},
})

export default function ChapterProvider(props: { children: React.ReactNode }) {
  const { children } = props

  const [activeMenuItem, setActiveMenuItem] = useState<EnMenuItem | null>(null)

  return (
    <ChapterContext.Provider
      value={{
        activeMenuItem,
        setActiveMenuItem,
      }}
    >
      {children}
    </ChapterContext.Provider>
  )
}

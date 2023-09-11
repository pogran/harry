'use client'

import { useContext } from 'react'
import { ChapterContext } from 'src/components/providers/ChapterProvider'
import cn from 'classnames'
import { ChapterSettingsContext } from 'src/components/providers/ChapterSettingsProvider'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { isBlurImage } from 'src/helpers/image.helper'
import Link from 'next/link'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnModal } from 'src/enums'
import { useTranslations } from 'next-intl'
import { isHentai } from 'src/helpers/main.helper'

export default function ContentWrapper(props: { children: React.ReactNode }) {
  const { chapterSettings } = useContext(ChapterSettingsContext)
  const { activeMenuItem } = useContext(ChapterContext)
  const { toggleModal } = useContext(ModalContext)
  const t = useTranslations()

  const { session } = useContext(AuthContext)
  const isBlur = isBlurImage(session?.user)
  const displayInfoBlock = isBlur || (!session && isHentai())

  return (
    <div
      className={cn('max-w-full mb-5', {
        '[&_>_div_img]:m-[0_0_0_auto]': activeMenuItem,
        'content-blur': isBlur,
      })}
      style={{ width: `${chapterSettings.width}px` }}
    >
      {displayInfoBlock && (
        <div className="text-center leading-5 grid px-2 py-2 mx-2 dark:text-white text-black-1000 bg-red-600 border-red-500 dark:bg-red-700 border dark:border-red-600 rounded-md my-4">
          {!session ? (
            <div>
              {t('To view the content, you must')}
              <div
                onClick={() => toggleModal(EnModal.AUTH)}
                className="text-sm underline cursor-pointer"
              >
                {t('Authorized')}
              </div>
            </div>
          ) : (
            <div>
              {t('The content available for people over then 18 ages')}
              <Link
                className="text-sm underline block cursor-pointer"
                href="/user/settings"
              >
                {t('Go in settings')}
              </Link>
            </div>
          )}
        </div>
      )}

      {props.children}
    </div>
  )
}

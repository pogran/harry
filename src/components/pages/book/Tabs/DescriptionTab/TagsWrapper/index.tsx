'use client'

import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function TagsWrapper(props: {
  children: JSX.Element
  isInvisibleTags: boolean
}) {
  const { children, isInvisibleTags } = props
  const [visible, setVisible] = useState(!isInvisibleTags)
  const t = useTranslations()

  if (!visible) {
    return (
      <p
        className="text-primary-main h-6 mt-0.5 ml-2 cursor-pointer font-medium hover:text-primary-hover flex text-tiny items-center"
        onClick={() => {
          setVisible(true)
        }}
      >
        {t('more tags')}
      </p>
    )
  }

  return <React.Fragment>{children}</React.Fragment>
}

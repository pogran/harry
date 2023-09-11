'server only'

import { useTranslations } from 'next-intl'
import React from 'react'
import DescriptionWrapper from './DescriptionWrapper'

export default function DescriptionTab(props: {
  desc: string | null
  additionInfo: string | null
}) {
  const t = useTranslations()

  return (
    <React.Fragment>
      <DescriptionWrapper>
        <div
          dangerouslySetInnerHTML={{
            __html:
              props.desc || `<p><i>${t('Description not set up')}</i></p>`,
          }}
          className="mb-2 text-gray-500 dark:text-gray-250"
        />
      </DescriptionWrapper>

      {!!props.additionInfo && (
        <div className=" text-sm italic font-medium">{props.additionInfo}</div>
      )}
    </React.Fragment>
  )
}

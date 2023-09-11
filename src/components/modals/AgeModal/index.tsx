'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { memo, useCallback, useContext } from 'react'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnMethod } from 'src/enums'
import { handleExceptionRequest } from 'src/helpers/exception.helper'
import { fetcher } from 'src/libs/fetcher'

export const AgeModal = memo(function AgeModal() {
  const t = useTranslations()
  const { session } = useContext(AuthContext)
  const { updateSessionUser } = useContext(AuthContext)
  const { toggleModal } = useContext(ModalContext)

  const onClick = useCallback(
    (isAdult: boolean) => {
      fetcher({
        url: '/users',
        session,
        params: {
          method: EnMethod.PATCH,
          body: JSON.stringify({ isAdult }),
        },
      })
        .then(() => {
          updateSessionUser({ isAdult })
          toggleModal(null)
        })
        .catch(handleExceptionRequest)
    },
    [session, toggleModal, updateSessionUser],
  )

  return (
    <React.Fragment>
      <h3 className="text-lg font-medium leading-6">
        {t('Content only for adult')}
      </h3>

      <div className="mt-8">
        {t(
          "This site contents content with don't available for people whose age less then 18 ages",
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-6">
        <button
          onClick={() => onClick(false)}
          className="rounded-md ring-inset dark:text-red-500 text-red-600 dark:hover:text-black-1000 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 dark:ring-red-500 ring-red-600 ring-1 outline-none"
        >
          {t("I don't have 18 ages")}
        </button>
        <button
          onClick={() => onClick(true)}
          className="rounded-md bg-primary-main font-medium px-3 py-2 text-sm text-white dark:text-black-1000"
        >
          {t('I have 18 ages')}
        </button>
      </div>
    </React.Fragment>
  )
})

export default AgeModal

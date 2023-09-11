'use client'

import { signIn } from 'next-auth/react'
import React, { memo, useCallback, useState } from 'react'
import { EnAuthView } from './types'
import { Icon } from 'src/components/common/Icon'
import { useTranslations } from 'next-intl'

export const Auth = memo(function Auth(props: {
  error?: string
  callbackUrl?: string
}) {
  const callbackUrl = props.callbackUrl ?? ''
  const [view, setView] = useState(EnAuthView.SING_IN)
  const t = useTranslations()

  const getBlockTitle = useCallback(() => {
    switch (view) {
      case EnAuthView.REGISTER: {
        return t('Register')
      }

      case EnAuthView.SING_IN:
      default: {
        return t('Signin in account')
      }
    }
  }, [t, view])

  return (
    <React.Fragment>
      <h3 className="text-lg font-medium leading-6">{getBlockTitle()}</h3>
      {props.error && (
        <p className="leading-5 mt-4 text-red-600 dark:text-red-500">
          {props.error}
        </p>
      )}
      <div className="mt-8">
        <div
          onClick={() => signIn('vk', { callbackUrl })}
          className="flex items-center w-full cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-black-500 hover:dark:bg-black-700 rounded-l-full rounded-r-full"
        >
          <div className="bg-[#3b6298] pl-5 pr-3 py-3 rounded-l-full">
            <Icon
              name="vk"
              className="!w-6 !h-6 text-white dark:text-stone-800"
            />
          </div>
          <span className="ml-5 uppercase text-sm leading-3">
            {t('throw vk')}
          </span>
        </div>

        <div
          onClick={() => signIn('google', { callbackUrl })}
          className="flex mt-4 items-center w-full cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-black-500 hover:dark:bg-black-700 rounded-l-full rounded-r-full"
        >
          <div className="bg-[#cc342b] pl-5 pr-2 py-3 rounded-l-full">
            <Icon
              name="google"
              className="!w-6 !h-6 ml-1 text-white dark:text-stone-800 leading-none"
            />
          </div>
          <span className="ml-5 uppercase text-sm leading-3">
            {t('throw google')}
          </span>
        </div>

        <div className="flex flex-col mt-6 items-center">
          <span className="text-sm font-medium text-secondary dark:text-gray-250">
            {view === EnAuthView.SING_IN
              ? t("Don't have account?")
              : t('Do you have account?')}
          </span>

          <span
            className="mt-1 text-primary-main hover:text-primary-hover cursor-pointer"
            onClick={() => {
              setView(
                view === EnAuthView.SING_IN
                  ? EnAuthView.REGISTER
                  : EnAuthView.SING_IN,
              )
            }}
          >
            {view === EnAuthView.SING_IN ? t('Register') : t('Login')}
          </span>
        </div>
      </div>
    </React.Fragment>
  )
})

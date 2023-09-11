'use client'

import React, {
  ChangeEvent,
  ChangeEventHandler,
  useContext,
  useRef,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import Select from 'react-select'
import cn from 'classnames'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { fetcher } from 'src/libs/fetcher'
import { EnMethod, EnToastType } from 'src/enums'
import { JwtUser } from 'types/next-auth'
import { addToast } from 'src/helpers/toastr.helper'
import Image from 'next/image'
import { getSelectTheme } from 'src/helpers/select.helper'
import { ThemeContext } from 'src/components/providers/ThemeProvider'
import { DEFAULT_USER_IMAGE } from 'src/config'
import { getImageSrc } from 'src/helpers/image.helper'
import { handleExceptionRequest } from 'src/helpers/exception.helper'

interface IntFrom {
  username: string
  isAdult: { value: number; label: string }
}

export default function UserSettings() {
  const t = useTranslations()
  const { session, updateSessionUser } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>(
    getImageSrc(session?.user.image ?? DEFAULT_USER_IMAGE),
  )

  const [file, setFile] = useState<File | null>(null)

  const adultOptions = [
    { value: 0, label: t('No') },
    { value: 1, label: t('Yes') },
  ]

  const isAdult = Number(session?.user.isAdult) || 0

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<IntFrom>({
    defaultValues: {
      username: session?.user.username || '',
      isAdult: adultOptions[isAdult],
    },
  })

  const onSubmit = (data: IntFrom) => {
    fetcher({
      url: '/users',
      session,
      params: {
        method: EnMethod.PATCH,
        body: JSON.stringify({ ...data, isAdult: !!data.isAdult.value }),
      },
    })
      .then((data: JwtUser) => {
        updateSessionUser({
          isAdult: data.isAdult,
          username: data.username,
        })

        addToast(t('Successfull save'), EnToastType.SUCCESS)
      })
      .catch((error) => {
        if (error?.error.includes('users_username_key')) {
          setError('username', {
            type: 'custom',
            message: t('This value already exists'),
          })
        } else {
          addToast(error.message, EnToastType.DANGER)
        }
      })
  }

  const saveAvatar = () => {
    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    fetcher({
      url: '/users/upload-image',
      session,
      params: {
        method: EnMethod.POST,
        body: formData,
      },
      isContentTypeJson: false,
    })
      .then(({ image }: { image: string }) => {
        updateSessionUser({ image })
        setFile(null)
      })
      .catch((error) => {
        handleExceptionRequest(error, true)
      })
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return
    }
    const file = event.target.files[0]

    if (!['image/jpeg', 'image/gif', 'image/png'].includes(file.type)) {
      return addToast(
        t('Available formats: jpeg, gif, png'),
        EnToastType.DANGER,
      )
    }

    if (file.size > 1024 * 1024) {
      return addToast(t('Available size: 1mb'), EnToastType.DANGER)
    }

    console.log('file', file)

    setAvatarUrl(URL.createObjectURL(event.target.files[0]))
    setFile(event.target.files[0])
  }

  return (
    <form className="grid max-w-sm m-auto" onSubmit={handleSubmit(onSubmit)}>
      <input
        ref={fileInputRef}
        hidden
        name="image"
        type="file"
        accept=".jpg, .jpeg, .png, .gif"
        onChange={onChange}
      />
      <div onClick={() => {}}></div>

      <div className="grid items-center grid-flow-col auto-cols-max gap-x-3">
        <Image
          width={50}
          height={50}
          onClick={() => {
            fileInputRef.current?.click()
          }}
          className="rounded-full w-[50px] h-[50px]"
          alt={session?.user.username ?? ''}
          src={avatarUrl}
        />

        <div
          onClick={() => {
            fileInputRef.current?.click()
          }}
          className="cursor-pointer hover:!bg-primary-main hover:!text-black-1000 ml-2 h-8 text-sm px-4 place-items-center inline-grid border dark:bg-black-600 dark:border-black-500 rounded-md bg-gray-100 border-gray-300"
        >
          {t('Choose')}
        </div>

        {file && (
          <div
            onClick={() => saveAvatar()}
            className="cursor-pointer hover:!bg-primary-main text-white dark:text-black-1000 ml-2 h-8 text-sm px-4 place-items-center inline-grid border border-primary-main rounded-md bg-primary-main"
          >
            {t('Save')}
          </div>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium leading-6"
        >
          {t('Username')}
        </label>
        <div className="mt-2 pb-4 relative">
          <input
            type="text"
            id="username"
            {...register('username', { required: t('Required to fill up') })}
            className={cn(
              'rounded-md w-full text-black-1000 dark:text-gray-75 dark:bg-black-600 bg-gray-100 border-gray-300 border focus:border-[var(--color-primary-main)] dark:border-black-500 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6',
              {
                'dark:!border-red-400 !border-red-600': errors.username,
              },
            )}
          />

          {errors.username && (
            <span className="text-xs absolute left-0 right-0 bottom-0 font-medium dark:text-red-400 text-red-600">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="w-full mr-2 mb-3">
          <label
            htmlFor="isAdult"
            className="block text-sm font-medium leading-6"
          >
            {t('18+')}
          </label>

          <Controller
            name="isAdult"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                instanceId="isAdult"
                isClearable={false}
                placeholder={t('Are you age more then 18 ages?')}
                className="mt-2"
                theme={(themeConfig) => getSelectTheme(theme, themeConfig)}
                options={adultOptions}
                noOptionsMessage={() => t("Don't have results")}
              />
            )}
          />
        </div>
      </div>

      <button className="md:w-full hover:bg-primary-main hover:text-white hover:dark:text-black-1000 md:mt-4 mr-1 md:mr-0 line-flex text-primary-main border-2 border-primary-main font-medium rounded-md text-sm px-5 py-2 text-center">
        {t('Save')}
      </button>
    </form>
  )
}

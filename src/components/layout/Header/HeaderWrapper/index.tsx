'use client'

import { useParams } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnModal } from 'src/enums'
import { isHentai } from 'src/helpers/main.helper'
import { BookWrapper } from './BookWrapper'

export const HeaderWrapper = (props: { children: React.ReactNode }) => {
  const params = useParams()
  const { session } = useContext(AuthContext)
  const { toggleModal } = useContext(ModalContext)

  useEffect(() => {
    if (session && session.user.isAdult === null && isHentai()) {
      toggleModal(EnModal.AGE)
    }
  }, [session, toggleModal])

  switch (true) {
    case params?.bookSlug !== undefined && params?.id !== undefined:
      return <React.Fragment />

    case params?.bookSlug !== undefined: {
      return <BookWrapper>{props.children}</BookWrapper>
    }

    default:
      return (
        <header className="bg-white dark:bg-black-700 dark:text-gray-150 top-0 w-full z-20 shadow sticky">
          {props.children}
        </header>
      )
  }
}

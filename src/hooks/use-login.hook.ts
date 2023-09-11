import { useTranslations } from 'next-intl'
import { useCallback, useContext } from 'react'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnModal } from 'src/enums'
import { addToastLogin } from 'src/helpers/toastr.helper'

export const useLogin = () => {
  const { toggleModal } = useContext(ModalContext)
  const t = useTranslations()

  const displayLoginPopup = useCallback(() => {
    toggleModal(EnModal.AUTH)
    addToastLogin(t('Need to auth'))
  }, [t, toggleModal])

  return {
    displayLoginPopup,
  }
}

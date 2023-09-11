import { Store } from 'react-notifications-component'
import { EnToastType } from 'src/enums'

export const addToast = (
  message: string,
  type: EnToastType = EnToastType.DANGER,
) => {
  Store.addNotification({
    message,
    type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  })
}

export const addToastLogin = async (text: string) => {
  return addToast(text, EnToastType.WARNING)
}

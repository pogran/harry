import { EnToastType } from 'src/enums'
import { addToast } from './toastr.helper'

export const handleExceptionRequest = (
  error: Error & { errors?: Record<string, string> },
  displayToastr = true,
) => {
  const errorMessage = error.errors
    ? Object.entries(error.errors)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    : error.message

  console.error('error', errorMessage)

  if (displayToastr) {
    return addToast(error.message, EnToastType.DANGER)
  }

  return error.errors ?? error.message
}

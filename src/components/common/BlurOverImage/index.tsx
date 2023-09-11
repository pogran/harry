'use client'

import { useContext } from 'react'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { isBlurImage } from 'src/helpers/image.helper'
import cn from 'classnames'
import { Icon } from '../Icon'

export const BlurOverImage = (props: { withBorder?: boolean }) => {
  const { session } = useContext(AuthContext)
  const { withBorder = true } = props

  if (!isBlurImage(session?.user)) {
    return null
  }

  return (
    <div
      className={cn(
        'inset-0 grid items-center justify-center dark:text-gray-75 rounded absolute !bg-opacity-[0.95] dark:bg-black-600 bg-gray-300',
        {
          'border dark:border-black-300 border-gray-400': withBorder,
        },
      )}
    >
      <Icon name="lock" />
    </div>
  )
}

import Image from 'next/image'
import React, { memo } from 'react'
import { getImageSrc } from 'src/helpers/image.helper'
import cn from 'classnames'

export const UserImage = memo(function UserImage(props: {
  className?: string
  width?: number
  height?: number
  username: string
  image: string
}) {
  const { width = 24, height = 24 } = props
  return (
    <Image
      width={width}
      height={height}
      src={getImageSrc(props.image)}
      alt={props.username}
      unoptimized
      className={cn(
        'rounded-full before:content-none after:content-none w-[24px] h-[24px]',
        props.className,
      )}
    />
  )
})

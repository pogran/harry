'use client'

import Image, { ImageProps } from 'next/image'
import React, { memo } from 'react'
import cn from 'classnames'
import { BlurOverImage } from '../BlurOverImage'

export const BlurImage = memo(function BlurImage(props: ImageProps) {
  return (
    <React.Fragment>
      <Image
        {...props}
        alt={props.alt || ''}
        className={cn('blur-[0.5px]', props.className)}
      />

      <BlurOverImage />
    </React.Fragment>
  )
})

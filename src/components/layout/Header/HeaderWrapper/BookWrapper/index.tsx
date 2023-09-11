'use client'

import React, { memo, useEffect, useState } from 'react'
import cn from 'classnames'

export const BookWrapper = memo(function BookHeaderWrapper(props: {
  children: React.ReactNode
}) {
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    const handleScrollBook = () => {
      if (window.scrollY === 0 && display) {
        return setDisplay(false)
      }

      if (window.scrollY > 0 && !display) {
        return setDisplay(true)
      }
    }

    window.addEventListener('scroll', handleScrollBook)
    return () => {
      window.removeEventListener('scroll', handleScrollBook)
    }
  }, [display])

  return (
    <header
      id="header"
      className={cn(
        'bg-white dark:bg-black-700 transform translate-x-[0%] dark:text-gray-150 top-0 w-full z-20 shadow fixed md:sticky',
        {
          'translate-y-[0%]': display,
          '-translate-y-full md:translate-y-[0%]': !display,
        },
      )}
    >
      {props.children}
    </header>
  )
})

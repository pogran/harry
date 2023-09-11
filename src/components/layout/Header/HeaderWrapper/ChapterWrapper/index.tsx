'use client'

import { useScrollDirection } from 'src/hooks'
import { useEffect, useState } from 'react'
import cn from 'classnames'

export default function ChapterWrapper(props: { children: React.ReactNode }) {
  const [display, setDisplay] = useState(false)
  const direction = useScrollDirection()

  useEffect(() => {
    if (document.body.clientWidth <= 768) {
      return
    }

    setDisplay(!direction)
  }, [direction])

  useEffect(() => {
    const handleClick = (event: UIEvent) => {
      if (document.body.clientWidth > 768) {
        return
      }
      if (!(event.target as Element).classList.contains('img')) {
        return
      }
      setDisplay(!display)
    }

    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [display])

  useEffect(() => {
    if (document.body.clientWidth > 768) {
      setDisplay(true)
    }
  }, [])

  return (
    <header
      id="header"
      className={cn(
        'bg-white dark:bg-black-700 transform-x-0 dark:text-gray-150 top-0 w-full z-20 fixed',
        {
          'shadow translate-y-0': display,
          '-translate-y-full': !display,
        },
      )}
    >
      {props.children}
    </header>
  )
}

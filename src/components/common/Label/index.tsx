'only server'

import Link from 'next/link'
import cn from 'classnames'

export default function Label(props: {
  link: string
  title: string
  isActive?: boolean
  className?: string
}) {
  const {
    link,
    title,
    isActive = false,
    className = 'dark:text-gray-300 text-gray-700 bg-gray-200 border-transparent dark:bg-black-600',
  } = props

  return (
    <Link
      href={link}
      className={cn(
        'm-0.5 px-3 block first-letter:uppercase rounded-sm py-[2px] md:px-5 hover:bg-primary-main border hover:text-white dark:hover:text-black-1000 hover:dark:bg-primary-main text-tiny',
        isActive ? '' : className,
        {
          'text-primary-main font-medium border-primary-main': isActive,
        },
      )}
    >
      {title}
    </Link>
  )
}

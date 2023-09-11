import { memo } from 'react'
import cn from 'classnames'

export const ArrowLongDownIcon = memo(function ArrowLongDownIcon(props: {
  className: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn('w-5 h-5', props.className)}
    >
      <path
        fillRule="evenodd"
        d="M10 2a.75.75 0 01.75.75v12.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z"
        clipRule="evenodd"
      />
    </svg>
  )
})
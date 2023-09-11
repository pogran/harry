'use client'

import ScrollContainer from 'react-indiana-drag-scroll'

export default function ScrollWrapper(props: {
  children: React.ReactNode
  className?: string
}) {
  const {
    children,
    className = 'scroll-container flex py-2 pb-6 bg-gray-50 dark:bg-black-700',
  } = props

  return <ScrollContainer className={className}>{children}</ScrollContainer>
}

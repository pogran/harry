'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, memo } from 'react'
import cn from 'classnames'
import { Icon } from '../Icon'
import { useTranslations } from 'next-intl'
import { IntDropdownItem } from './types'

export const Dropdown = memo(function Dropdown(props: {
  items: IntDropdownItem[]
  placeholder?: string
  className?: string
  menuClassName?: string
}) {
  const t = useTranslations()
  const { placeholder = t('Action') } = props

  return (
    <div className={cn('flex items-center', props.className)}>
      <Menu as="div" className="relative inline-block text-left rounded-md">
        {({ open }) => (
          <>
            <Menu.Button className="uppercase hover:bg-gray-100 dark:hover:bg-black-600 py-1 outline-none focus:outline-none pl-1 pr-2 cursor-pointer justify-between rounded-md flex items-center text-xs">
              <span className="pl-1 pr-2">{placeholder}</span>
              <Icon
                name="chevronDown"
                className={cn('ml-1', {
                  'rotate-180': open,
                })}
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className={cn(
                  'absolute w-max left-0 z-10 text-black-1000 dark:text-gray-75 border border-gray-100 dark:border-black-700 mt-2 md:mt-1 right-0 origin-top-right rounded-sm bg-white dark:bg-black-600 shadow-lg focus:outline-none',
                  props.menuClassName,
                )}
              >
                {props.items.map((item, key) => (
                  <Menu.Item key={key}>
                    {({ active }) => (
                      <button
                        onClick={() => item.onClick && item.onClick()}
                        className={cn(
                          'flex justify-between text-sm w-full py-1.5 items-center pl-10 relative',
                          item.className,
                          {
                            'hover:bg-gray-100 dark:hover:bg-black-700 text-primary-main':
                              active,
                            'pr-1.5': item.icon,
                            'pr-6': !item.icon,
                          },
                        )}
                      >
                        {item.label}
                        {item.icon ? item.icon : ''}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
})

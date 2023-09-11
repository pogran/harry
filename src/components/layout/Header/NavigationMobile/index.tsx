'use client'

import { Popover, Transition } from '@headlessui/react'
import { Fragment, memo } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { IntItem } from '../types'
import { Icon } from 'src/components/common/Icon'
import { usePathname } from 'next/navigation'

export const NavigationMobile = memo(function NavigationMobile(props: {
  items: IntItem[]
}) {
  const pathname = usePathname()

  return (
    <Popover className="block md:hidden">
      <Popover.Button
        id="open-menu"
        className="rounded-md p-2 flex-shrink-0 text-gray-400 dark:text-gray-200 focus:outline-none"
      >
        <span className="sr-only">Open main menu</span>
        <Icon name="bars3" />
      </Popover.Button>
      <Transition.Root as={Fragment}>
        <div className="">
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Overlay
              className="z-20 fixed inset-0 bg-black-1000 bg-opacity-25"
              aria-hidden="true"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="z-30 fixed dark:bg-black-600 bg-white lg:absolute top-0 left-0 min-w-[270px] h-screen max-w-[270px] transition transform origin-top"
            >
              {() => (
                <div className="shadow-lg h-full">
                  <div className="pt-3 pb-2">
                    <div className="mt-3">
                      <nav className="flex flex-col md:flex-row md:ml-6 md:items-center">
                        {props.items.map((item) => (
                          <Popover.Button
                            key={item.name}
                            id={`button-${item.name}`}
                            as={Link}
                            href={item.href}
                            className={cn(
                              'flex hover:bg-gray-100 dark:hover:bg-black-700 font-medium md:inline-block items-center justify-between outline-none border-b-0 border-transparent text-base md:text-sm hover:text-primary-main md:border-b-[3px] px-5 py-2 md:px-3 md:py-3',
                              {
                                'text-primary-main border-primary-main bg-gray-100 dark:bg-black-700':
                                  item.href === pathname,
                              },
                            )}
                          >
                            {item.name}
                            {item.icon}
                          </Popover.Button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Transition.Child>
        </div>
      </Transition.Root>
    </Popover>
  )
})

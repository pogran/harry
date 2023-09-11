'use client'

import { AuthContext } from 'src/components/providers/AuthProvider'
import { Fragment, memo, useContext } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnModal } from 'src/enums'
import { useTranslations } from 'next-intl'
import cn from 'classnames'
import { ThemeButton } from '../ThemeButton'
import { UserIcon } from './UserIcon'
import { UserTooltip } from './UserTooltip'

export const SettingsNav = memo(function SettingsNav() {
  const { session } = useContext(AuthContext)
  const { toggleModal } = useContext(ModalContext)
  const t = useTranslations()

  return (
    <div className="flex items-center">
      {!session && <ThemeButton className="hidden md:flex" />}
      {!session && (
        <button
          onClick={() => toggleModal(EnModal.AUTH)}
          className="hidden outline-none md:block ml-8 hover:text-white dark:hover:text-black-1000 hover:bg-primary-main text-xs font-medium uppercase border cursor-pointer border-primary-main py-1 px-3 rounded-md text-primary-main"
        >
          {t('Sign in')}
        </button>
      )}

      <Popover
        className={cn('flex relative', {
          'md:hidden': !session,
        })}
      >
        <Popover.Overlay
          className="z-20 fixed inset-0 h-screen md:h-0 bg-black-1000 bg-opacity-25"
          aria-hidden="true"
        />
        <Popover.Button
          id="settings"
          className="p-2 outline-none flex-shrink-0 text-gray-400 dark:text-gray-2"
        >
          <UserIcon />
        </Popover.Button>
        <Transition.Root as={Fragment}>
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
              className="z-30 fixed top-0 right-0 min-w-[270px] h-screen md:h-auto max-w-[270px] md:min-w-[250px] md:max-w-[250px] transition transform origin-top md:top-full md:absolute"
            >
              {({ close }) => <UserTooltip close={close} />}
            </Popover.Panel>
          </Transition.Child>
        </Transition.Root>
      </Popover>
    </div>
  )
})

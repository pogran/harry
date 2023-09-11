'use client'

import { Dialog, Transition } from '@headlessui/react'
import { EnModal } from 'src/enums'
import React, {
  Fragment,
  useState,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { Icon } from '../common/Icon'
import AgeModal from './AgeModal'

const AuthModal = lazy(() => import('./AuthModal'))

export default function Modals() {
  const { activeModal, toggleModal } = useContext(ModalContext)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(activeModal ? true : false)
  }, [activeModal])

  const closeModal = useCallback(() => {
    toggleModal(null)
    setIsOpen(false)
  }, [toggleModal])

  const renderModal = useCallback(() => {
    switch (activeModal) {
      case EnModal.AUTH: {
        return <AuthModal />
      }

      case EnModal.AGE: {
        return <AgeModal />
      }

      default:
        return <React.Fragment />
    }
  }, [activeModal])

  if (!activeModal) {
    return <React.Fragment />
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black-1000 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full min-w-[340px] max-w-md transform overflow-hidden rounded-2xl text-black-1000 dark:text-gray-75 bg-white dark:bg-black-600 py-5 px-8 text-left align-middle shadow-xl transition-all">
                <Suspense
                  fallback={
                    <div className="flex justify-center w-full mt-2">
                      <Icon name="spinner" />
                    </div>
                  }
                >
                  {renderModal()}
                </Suspense>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

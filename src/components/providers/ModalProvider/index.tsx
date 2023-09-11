'use client'

import { createContext, useState } from 'react'
import { EnModal } from 'src/enums'

export const ModalContext = createContext<{
  activeModal: EnModal | null
  toggleModal: (value: EnModal | null) => void
}>({
  activeModal: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleModal: (value: EnModal | null) => {},
})

interface IntProps {
  children: React.ReactNode
}

export default function ModalProvider({ children }: IntProps) {
  const [activeModal, setActiveModal] = useState<EnModal | null>(null)

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        toggleModal: (v) => {
          setActiveModal(v)
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

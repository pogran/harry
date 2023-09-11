'use client'

import { Tooltip, TooltipProvider } from 'react-tooltip'

interface IntProps {
  children: React.ReactNode
}

export default function TooltipProviderWrapper({ children }: IntProps) {
  return (
    <TooltipProvider>
      <Tooltip className="z-10" />
      {children}
    </TooltipProvider>
  )
}

import { EnMenuItem } from 'src/enums'

export interface IntMenuItem {
  id: EnMenuItem
  className: string
  isBeta: boolean
  icon: JSX.Element
  onClick?: () => void
}

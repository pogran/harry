import { EnMenuItem } from 'src/enums'

export interface IntContext {
  activeMenuItem: EnMenuItem | null
  setActiveMenuItem: (item: EnMenuItem | null) => void
}

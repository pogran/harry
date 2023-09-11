import { SettingsNav } from './SettingsNav'
import { Icon } from 'src/components/common/Icon'
import { IntItem } from './types'
import { NavigationMobile } from './NavigationMobile'
import { Navigation } from './Navigation'
import { LogoWrapper } from './LogoWrapper'

export default function Header(props: { items: IntItem[] }) {
  return (
    <div className="max-w-7xl md:mx-2 xl:mx-auto">
      <div className="flex justify-between h-12 items-center">
        <NavigationMobile items={props.items} />

        <div className="hidden md:flex pl-1 pr-2 lg:px-0">
          <div className="flex-shrink-0 flex-end flex items-center">
            <LogoWrapper>
              <Icon name="logo" />
            </LogoWrapper>
          </div>
          <Navigation items={props.items} />
        </div>
        <LogoWrapper className="block md:hidden">
          <Icon name="logo" />
        </LogoWrapper>
        <SettingsNav />
      </div>
    </div>
  )
}

import React from 'react'
import {
  ArrowLongDownIcon,
  ArrowRightLeftIcon,
  ArrowRightOnRectangleIcon,
  BookmarkFullIcon,
  BookmarkIcon,
  CheckIcon,
  ChevronDownIcon,
  CommentIcon,
  HeartFullIcon,
  HeartIcon,
  ListBulletIcon,
  ListIcon,
  MoonIcon,
  SearchIcon,
  SettingIcon,
  SpinnerIcon,
  SunIcon,
  UserIcon,
  CloseIcon,
  Bars3Icon,
  LogoIcon,
  TrashIcon,
  GoogleIcon,
  VkIcon,
  LockIcon,
  WrenchScrewdriverIcon,
} from 'src/components/icons'
import { IconType } from './types'

export const Icon = function Icon(props: {
  name: IconType
  className?: string
}) {
  const { name, className = '' } = props

  switch (name) {
    case 'heart':
      return <HeartIcon className={className} />

    case 'heartFull':
      return <HeartFullIcon className={className} />

    case 'spinner':
      return <SpinnerIcon className={className} />

    case 'settings':
      return <SettingIcon className={className} />

    case 'list':
      return <ListIcon className={className} />

    case 'comment':
      return <CommentIcon className={className} />

    case 'bookmark':
      return <BookmarkIcon className={className} />

    case 'bookmarkFull':
      return <BookmarkFullIcon className={className} />

    case 'close':
      return <CloseIcon className={className} />

    case 'chevronDown':
      return <ChevronDownIcon className={className} />

    case 'arrowRightLeft':
      return <ArrowRightLeftIcon className={className} />

    case 'arrowLongDown':
      return <ArrowLongDownIcon className={className} />

    case 'check':
      return <CheckIcon className={className} />

    case 'user':
      return <UserIcon className={className} />

    case 'moon':
      return <MoonIcon className={className} />

    case 'sun':
      return <SunIcon className={className} />

    case 'arrowRightOnRectangle':
      return <ArrowRightOnRectangleIcon className={className} />

    case 'listBullet':
      return <ListBulletIcon className={className} />

    case 'search':
      return <SearchIcon className={className} />

    case 'bars3':
      return <Bars3Icon className={className} />

    case 'logo':
      return <LogoIcon className={className} />

    case 'trash':
      return <TrashIcon className={className} />

    case 'google':
      return <GoogleIcon className={className} />

    case 'vk':
      return <VkIcon className={className} />

    case 'lock':
      return <LockIcon className={className} />

    case 'wrenchScrewdriver':
      return <WrenchScrewdriverIcon className={className} />

    default:
      return <React.Fragment />
  }
}

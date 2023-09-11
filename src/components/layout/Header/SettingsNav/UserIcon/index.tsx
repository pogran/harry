import { memo, useContext } from 'react'
import { Icon } from 'src/components/common/Icon'
import { UserImage } from 'src/components/common/UserImage'
import { AuthContext } from 'src/components/providers/AuthProvider'

export const UserIcon = memo(function UserIcon() {
  const { session } = useContext(AuthContext)

  if (!session) {
    return <Icon name="user" className="text-gray-400 dark:text-gray-200" />
  }

  console.log('session', session)

  return (
    <UserImage
      className="!w-[28px] !h-[28px]"
      username={session.user.username}
      image={session.user.image}
      width={28}
      height={28}
    />
  )
})

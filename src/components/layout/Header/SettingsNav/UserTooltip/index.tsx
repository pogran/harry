import { useTranslations } from 'next-intl'
import { memo, useContext } from 'react'
import { UserImage } from 'src/components/common/UserImage'
import { AuthContext } from 'src/components/providers/AuthProvider'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { EnModal } from 'src/enums'
import { Menu } from './Menu'

export const UserTooltip = memo(function UserTooltip(props: {
  close: () => void
}) {
  const { session } = useContext(AuthContext)
  const { toggleModal } = useContext(ModalContext)
  const t = useTranslations()

  return (
    <div className="shadow-lg h-full pt-3 pb-3 md:rounded-md md:border md:border-gray-100 md:dark:border-black-700 bg-white dark:bg-black-600">
      {session ? (
        <div className="px-4 flex items-center truncate mb-5">
          <div className="flex-shrink-0 leading-none">
            <UserImage
              className="!w-[40px] !h-[40px]"
              username={session.user.username}
              image={session.user.image}
              width={40}
              height={40}
            />
          </div>
          <span className="text-sm font-medium ml-3 text-black-1000 dark:text-white truncate">
            {session.user.username}
          </span>
        </div>
      ) : (
        <div className="px-2 mt-2 pb-6 flex flex-col items-center">
          <p className="text-tiny italic text-center text-gray-400 leading-4 pb-6">
            {t('Sign in and get more abilities')}
          </p>
          <button
            className="flex focus:outline-none items-center justify-center px-10 py-2 border border-primary-main rounded-md shadow-sm text-base font-medium text-primary-main"
            onClick={() => {
              props.close()
              toggleModal(EnModal.AUTH)
            }}
          >
            {t('Sign in')}
          </button>
        </div>
      )}
      <Menu close={props.close} />
    </div>
  )
})

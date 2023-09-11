import { getTranslations } from 'next-intl/server'
import { Auth } from 'src/components/pages/auth/signin'
import { AuthEnum, EnAuth } from 'src/enums'

export default async function Page(props: {
  searchParams?: { error?: EnAuth; callbackUrl?: string }
}) {
  const t = await getTranslations()
  const { searchParams } = props
  const callbackUrl = searchParams?.callbackUrl
    ? decodeURIComponent(searchParams.callbackUrl)
    : undefined

  const error = searchParams?.error
    ? t(new AuthEnum().getLabel(searchParams.error))
    : undefined

  return (
    <div className="grid min-h-screen content-center justify-items-center">
      <div className="w-full place-content-center max-w-sm transform overflow-hidden rounded-2xl text-black-1000 dark:text-gray-75 bg-white dark:bg-black-600 py-10 px-8 text-left align-middle shadow-xl transition-all opacity-100 scale-100">
        <Auth callbackUrl={callbackUrl} error={error} />
      </div>
    </div>
  )
}

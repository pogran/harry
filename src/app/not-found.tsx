import { useTranslations } from 'next-intl'

const NotFound = () => {
  const t = useTranslations()
  return t('Page not found')
}
export default NotFound

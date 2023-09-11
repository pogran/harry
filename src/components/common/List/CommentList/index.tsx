import { useTranslations } from 'next-intl'
import { memo } from 'react'

const CommentList = memo(function CommentList() {
  const t = useTranslations()
  return <p>{t('Section in work 🤗')}</p>
})

export default CommentList

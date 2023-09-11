import { Session } from 'next-auth'
import { baseApi } from 'src/config'
import { RequestInit } from './types'

export const fetcher = async (props: {
  url: string
  session?: Session | null
  params?: RequestInit
  isContentTypeJson?: boolean
}) => {
  const { url, session = null, isContentTypeJson = true } = props
  let params = props.params ?? undefined

  const authHeader: Record<string, string> = {
    authorization: `Bearer ${session?.user.accessToken}`,
  }

  if (isContentTypeJson) {
    authHeader['Content-Type'] = 'application/json'
  }

  if (session) {
    params = params
      ? {
          ...params,
          headers: params.headers
            ? { ...authHeader, ...params.headers }
            : authHeader,
        }
      : { headers: authHeader }
  }

  const res = await fetch(`${baseApi}${url}`, params)

  if (res.ok) {
    return (await res.json()).content
  }
  const error = await res.json()
  throw error
}

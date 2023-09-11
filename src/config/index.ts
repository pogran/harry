import { EnBookOrderBy } from 'src/enums'
import { EnSort } from 'src/enums'

export const TOKEN_EXPIRED_AT = 30 * 24 * 60 * 60

export const UPDATES_COUNT = 20

export const CATALOG_BOOKS_COUNT_DESK = 20
export const SEARCH_GRID_BOOKS = 24
export const CATALOG_BOOKS_COUNT_MOBILE = 21

export const BOOKS_COUNT_DESK = 24
export const BOOKS_COUNT_MOBILE = 21

export const CHAPTERS_COUNT = 30

export const MANGA_DOMAIN = 'https://топманга.рф'
export const HENTAI_MANGA_DOMAIN = 'https://хентайманга.рф/'

// new code
export const DEFAULT_BOOKS_SORT = EnSort.DESC
export const DEFAULT_BOOKS_ORDER_BY = EnBookOrderBy.NEW
export const baseApi = process.env.NEXT_PUBLIC_ENV_BACKEND_DOMAIN + '/api2'
export const BOOK_MIN_COUNT_TAGS = 10

// search page
export const SEARCH_MIN_LENGTH = 3

export const DEFAULT_USER_IMAGE = '/images/users/default-user.jpg'

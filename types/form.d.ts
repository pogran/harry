import { EnBookType } from '@prisma/client'

export interface IntCatalogFilters {
  types?: string | string[]
  genres?: string | string[]
  tags?: string | string[]
  persons?: string | string[]
  serie?: string
}

export interface IntCatalogFormData {
  types?: EnBookType[]
  genres?: number[]
  tags?: number[]
  persons?: number[]
  serie?: number
}

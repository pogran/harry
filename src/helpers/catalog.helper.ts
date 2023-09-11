import { IntCatalogFormData } from 'types/form'

export const getTags = (filtersData: IntCatalogFormData) => {
  let tags: number[] = []
  if (filtersData.tags) {
    tags = [...tags, ...filtersData.tags]
  }
  if (filtersData.persons) {
    tags = [...tags, ...filtersData.persons]
  }
  return tags
}

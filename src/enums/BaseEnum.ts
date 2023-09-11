import { BaseEnumInt, EnumMapType } from './types'

export class BaseEnum<T extends string> implements BaseEnumInt<T> {
  getLabels() {
    return {} as Readonly<EnumMapType<T>>
  }

  getDefaultLabel(name: string) {
    return `Option not found: ${name}`
  }

  getLabel(id: T) {
    const labels = this.getLabels()
    return id in labels ? labels[id] : this.getDefaultLabel(id)
  }
}

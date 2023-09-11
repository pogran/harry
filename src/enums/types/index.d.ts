export interface BaseEnumInt<T extends string> {
  getLabels: () => Readonly<EnumMap<T>>
  getLabel: (id: T) => Readonly<string>
  getDefaultLabel: (name: string) => string
}

export type EnumMapType<T extends string> = {
  [key in T]: string
}

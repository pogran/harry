export interface StringMap<T> {
  [key: string]: T
}

export interface IntOption {
  value: string | number
  label: string
  __isNew__?: boolean
}

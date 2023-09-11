export const generateToken = (length: number) => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  const charLength = chars.length
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength))
  }
  return result
}

export function commonArrayElements<T>(firstArray: T[], secondArray: T[]) {
  const setFirst = new Set(firstArray)
  return secondArray.filter((el) => setFirst.has(el))
}

export const isEmptyObject = (object: object) => {
  return Object.keys(object).length === 0
}

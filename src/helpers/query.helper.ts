export const objectToQueryString = (object: {
  [x: string]: string | string[]
}) => {
  return Object.keys(object)
    .map((key) => {
      const v = key as unknown as keyof { [x: string]: string | string[] }
      if (Array.isArray(object[v])) {
        return (object[v] as string[]).map((el) => key + '=' + el).join('&')
      }
      return `${key}=${object[v]}`
    })
    .join('&')
}

export const generateNumber = (from: number, to: number) => {
  return Math.floor(from + (to - from) * Math.random())
}

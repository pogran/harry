import { Theme } from 'react-select'
import { EnTheme } from 'src/enums'

export const getSelectTheme = (
  theme: EnTheme,
  themeConfig: Theme,
  isError = false,
  isSuccess = false,
) => {
  const colors =
    theme === EnTheme.DARK
      ? {
          primary: '#fb8c00',
          neutral80: '#d2d2d2', // text color
          neutral50: '#aaaaaa', // placeholder
          neutral60: '#fb8c00', // icon color
          neutral20: isError ? '#f05252' : isSuccess ? '#047857' : '#3a3a3a', // border
          neutral30: '#fb8c00', // border-hover
          primary50: '#141414', // click bg
          primary25: '#141414', // hover point
          neutral0: '#262626', // bg rgb(243 244 246)
          neutral5: '#101010', // disabled bg
          neutral10: '#3a3a3a', // mutliselect element
          neutral40: '#fb8c00', // hover icon down
          danger: '#000', // multi select delete icon
          dangerLight: '#fb8c00', // multi select delete bg
        }
      : {
          neutral10: '#F3F4F6',
          primary: '#f15a24',
          neutral60: '#f15a24', // icon color
          neutral20: isError ? '#e02424' : isSuccess ? '#059669' : '#e5e7eb', // border
          neutral30: '#f15a24', // border-hover
          neutral5: '#ebebeb',
          neutral0: 'rgb(243 244 246)', // bg
          primary25: '#f3f4f6', // hover point
          danger: '#fff', // multi select delete icon
          dangerLight: '#f15a24', // multi select delete bg
        }

  return {
    ...themeConfig,
    spacing: {
      ...themeConfig.spacing,
      // baseUnit: 2,
      controlHeight: 36,
    },
    colors: {
      ...themeConfig.colors,
      ...colors,
      // primary75: 'red',
      // neutral70: 'red',
      // neutral90: 'red',
    },
  }
}

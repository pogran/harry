import { useContext, useState, useEffect, memo } from 'react'
import { ChapterSettingEnum, EnChapterSetting } from 'src/enums'
import { ChapterSettingsContext } from 'src/components/providers/ChapterSettingsProvider'
import { useDebounce } from 'src/hooks'
import { useTranslations } from 'next-intl'

const Settings = memo(function Settings() {
  const { changeChapterSetting, chapterSettings } = useContext(
    ChapterSettingsContext,
  )
  const [width, setWidth] = useState(chapterSettings.width)
  const debouncedWidth = useDebounce(width, 1000)
  const t = useTranslations()

  useEffect(() => {
    if (chapterSettings.width === debouncedWidth) {
      return
    }
    changeChapterSetting(EnChapterSetting.WIDTH, debouncedWidth)
  }, [changeChapterSetting, debouncedWidth, chapterSettings])

  return (
    <>
      <h4 className="font-medium text-lg md:text-xl leading-5">
        {t('Settings for reader')}
      </h4>
      <div className="mt-7 md:hidden">
        {t("Mobile version doesn't have settings yet 😊")}
      </div>

      <div className="mt-7 hidden md:block">
        <p>
          {t(ChapterSettingEnum.getLabels()[EnChapterSetting.WIDTH])}

          <span className="ml-4">{width}px</span>
        </p>
        <input
          id="width-range"
          type="range"
          min={600}
          max={1600}
          style={{
            backgroundSize: `${((width - 600) * 100) / (1600 - 600)}% 100%`,
          }}
          step={10}
          onChange={(e) => {
            const v = Number(e.target.value)
            setWidth(v)
          }}
          value={width}
          className="w-full h-1 mb-6 mt-4 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
        />
      </div>
    </>
  )
})

export default Settings

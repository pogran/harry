'use client'

import { Tab } from '@headlessui/react'
import cn from 'classnames'
import { useTranslations } from 'next-intl'

export type TabType = 'Desc' | 'Statistic' | 'Comments'

export default function Tabs(props: { children: React.ReactNode }) {
  const t = useTranslations()

  const tabs = {
    Desc: {
      render: () => <>{props.children}</>,
    },
    Statistic: {
      render: () => <p className="">{t('Section in work 🤗')}</p>,
    },
    Comments: {
      render: () => <p className="">{t('Section in work 🤗')}</p>,
    },
  }

  const getTabName = (tabId: TabType) => {
    switch (tabId) {
      case 'Desc': {
        return t('Description')
      }

      case 'Statistic': {
        return t('Statistic')
      }

      case 'Comments': {
        return t('Comments')
      }

      default: {
        return ''
      }
    }
  }

  return (
    <Tab.Group>
      <Tab.List className="border-b-1 md:border-0 mt-0 md:mt-3 dark:border-black-500">
        <nav className="-mb-px flex" aria-label="Tabs">
          {(Object.keys(tabs) as TabType[]).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                cn(
                  'w-1/3 md:w-auto font-medium py-3 px-1 md:px-4 md:py-3 text-center border-b-2 hover:text-primary-main text-sm',
                  {
                    'text-primary-main focus:outline-0 border-primary-main bg-gray-50 md:bg-transparent dark:bg-black-700 md:dark:bg-transparent':
                      selected,
                    'border-gray-200 dark:border-black-500 dark:text-main':
                      !selected,
                  },
                )
              }
            >
              {getTabName(tab)}
            </Tab>
          ))}
        </nav>
      </Tab.List>
      <Tab.Panels className="mt-5 mx-2 md:mx-0">
        {Object.values(tabs).map((tabData, idx) => (
          <Tab.Panel key={idx}>{tabData.render()}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

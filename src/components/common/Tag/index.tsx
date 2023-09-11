'server only'

import { EnTagType, Tag as TagModel } from '@prisma/client'
import Label from '../Label'

export default function Tag(props: { tag: TagModel }) {
  const { tag } = props

  if (tag.type === EnTagType.COLLECTION) {
    return (
      <h6>
        <Label
          className="bg-transparent border-red-500 hover:border-transparent text-red-500 dark:bg-black-700 dark:border-red-400 hover:dark:border-transparent dark:text-red-400"
          title={tag.title}
          link={`/books?serie=${tag.serieId}&persons=${tag.id}`}
        />
      </h6>
    )
  }

  return <Label title={tag.title} link={`/manga?tags=${tag.id}`} />
}

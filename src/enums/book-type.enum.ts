import { EnBookType } from '@prisma/client'
import { BaseEnum } from './BaseEnum'

export class BookTypeEnum extends BaseEnum<EnBookType> {
  static getLabels() {
    return {
      [EnBookType.INDONESIAN_COMIC]: 'Indonesia comics',
      [EnBookType.MANGA]: 'Manga',
      [EnBookType.MANHUA]: 'Manhua',
      [EnBookType.MANHWA]: 'Manhwa',
      [EnBookType.OEL]: 'OEL-manga',
      [EnBookType.RUS_COMIC]: 'Ru-manga',
      [EnBookType.WESTERN_COMIC]: 'Western comics',
      [EnBookType.ANOTHER]: 'Another',
    }
  }
}

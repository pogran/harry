import { EnBookmarkType } from '@prisma/client'
import { BaseEnum } from './BaseEnum'

export class BookmarkTypeEnum extends BaseEnum<EnBookmarkType> {
  static getLabels() {
    return {
      [EnBookmarkType.PLAN]: 'In plan',
      [EnBookmarkType.READ]: 'Reading',
      [EnBookmarkType.ABANDONED]: 'Abandoned',
      [EnBookmarkType.COMPLETED]: 'Was read',
      [EnBookmarkType.FAVORITE]: 'Favorite',
      [EnBookmarkType.CUSTOM]: 'Custom',
    }
  }
}

import { BaseEnum } from './BaseEnum'

export enum EnBookOrderBy {
  NEW = 'id',
  UPDATE = 'newUploadAt',
}

export class BookOrderByEnum extends BaseEnum<EnBookOrderBy> {
  static getLabels() {
    return {
      [EnBookOrderBy.NEW]: 'By new',
      [EnBookOrderBy.UPDATE]: 'By updates',
    }
  }
}

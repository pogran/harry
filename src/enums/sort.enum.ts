import { BaseEnum } from './BaseEnum'

export enum EnSort {
  DESC = 'desc',
  ASC = 'asc',
}

export class SortEnum extends BaseEnum<EnSort> {
  static getLabels() {
    return {
      [EnSort.DESC]: 'show from start',
      [EnSort.ASC]: 'show from end',
    }
  }
}

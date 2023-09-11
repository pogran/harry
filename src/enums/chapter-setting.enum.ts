import { BaseEnum } from './BaseEnum'

export enum EnChapterSetting {
  WIDTH = 'width',
}

export class ChapterSettingEnum extends BaseEnum<EnChapterSetting> {
  static getLabels() {
    return {
      [EnChapterSetting.WIDTH]: 'Container width',
    }
  }
}

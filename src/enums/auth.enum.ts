import { BaseEnum } from './BaseEnum'

export enum EnAuth {
  NOT_LINKED = 'OAuthAccountNotLinked',
  CREATE_ACCOUNT = 'OAuthCreateAccount',
  EMAIL_VERIFIED = 'EmailVerified',
  CALLBACK = 'Callback',
}

export class AuthEnum extends BaseEnum<EnAuth> {
  getLabels() {
    return {
      [EnAuth.NOT_LINKED]:
        'For authorization you use another method, auth use it',
      [EnAuth.CREATE_ACCOUNT]: 'Some problem with database',
      [EnAuth.EMAIL_VERIFIED]:
        "This method don't have confirm email, need to confirm email",
      [EnAuth.CALLBACK]: 'Error when data was processed',
    }
  }

  getDefaultLabel(name: string) {
    return `Error not found: ${name}`
  }
}

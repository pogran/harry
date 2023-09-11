import { generateNumber } from 'src/helpers/math.helper'
import { prisma } from 'src/instances/prisma'
import { getImageExtByMimeType } from 'src/helpers/image.helper'
import fs, { createWriteStream } from 'fs'
import { DEFAULT_USER_IMAGE } from 'src/config'

export class UserService {
  private static async setDefaultUserImage(id: number) {
    await prisma.user.update({
      where: { id },
      data: {
        image: DEFAULT_USER_IMAGE,
      },
    })
  }

  public static async uploadImage(image: null | string, userId: number) {
    if (!image) {
      return this.setDefaultUserImage(userId)
    }

    try {
      const imageRes = await fetch(image)
      const arrayBuffer = await imageRes.arrayBuffer()
      const mimeType = imageRes.headers.get('content-type')
      const path = `${process.env.IMAGE_PATH}/users/${userId}`
      fs.mkdirSync(path, { recursive: true })
      const fileName = `avatar-${generateNumber(
        1,
        100,
      )}.${getImageExtByMimeType(mimeType || '')}`

      const ws = createWriteStream(`${path}/${fileName}`)
      ws.write(Buffer.from(arrayBuffer))

      await prisma.user.update({
        where: { id: userId },
        data: {
          image: `/images/users/${userId}/${fileName}`,
        },
      })

      return `/images/users/${userId}/${fileName}`
    } catch (e) {
      await this.setDefaultUserImage(userId)

      return DEFAULT_USER_IMAGE
    }
  }
  public static async getUsername(username: string | null) {
    username = username || 'random'

    // if we have this username, then generate name with random numbers because name unique
    const findUser = await prisma.user.findUnique({
      where: { username },
    })
    if (findUser) {
      username = `${username}-${generateNumber(1, 100)}`
    }
    return username
  }
}

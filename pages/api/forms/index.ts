import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new Error()
    }

    const forms = await client.form.findMany({
      where: { users: { some: { id: userId } } },
    })

    await client.$disconnect()
    res.status(200)
    res.json(forms)
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
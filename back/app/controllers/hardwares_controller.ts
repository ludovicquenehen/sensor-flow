import type { HttpContext } from '@adonisjs/core/http'
import Hardware from '../models/hardware.js'
import User from '../models/user.js'

export default class HardwaresController {
  async index({ auth }: HttpContext) {
    const projectIds = (
      await User.query()
        .where('id', auth.user?.id || '')
        .preload('projects')
        .firstOrFail()
    ).projects.map((e) => e.toJSON().id)
    const snapshots = await Hardware.query().whereIn('projectId', projectIds)
    return snapshots.map((e: Hardware) => e.toJSON()) || []
  }

  async store({ request }: HttpContext) {
    return await Hardware.create({ ...request.body() })
  }

  async get({ request }: HttpContext) {
    return await Hardware.findOrFail(request.param('id'))
  }

  async update({ request }: HttpContext) {
    let hardware = await Hardware.findOrFail(request.param('id'))
    return await hardware.merge({ ...request.body() }).save()
  }

  async delete({ request }: HttpContext) {
    const user = await Hardware.findOrFail(request.param('id'))
    return await user.delete()
  }
}

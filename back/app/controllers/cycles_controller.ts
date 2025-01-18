import type { HttpContext } from '@adonisjs/core/http'
import Cycle from '../models/cycle.js'
import User from '../models/user.js'
import Program from '../models/program.js'

export default class CyclesController {
  async index({ auth }: HttpContext) {
    const projectIds = (
      await User.query()
        .where('id', auth.user?.id || '')
        .preload('projects')
        .firstOrFail()
    ).projects.map((e) => e.toJSON().id)

    const programIds = (await Program.query().whereIn('projectId', projectIds)).map(
      (e) => e.toJSON().id
    )
    const cycles = await Cycle.query().whereIn('programId', programIds)
    return cycles.map((e: Cycle) => e.toJSON()) || []
  }

  async store({ request }: HttpContext) {
    return await Cycle.create({ ...request.body() })
  }

  async get({ request }: HttpContext) {
    return await Cycle.findOrFail(request.param('id'))
  }

  async update({ request }: HttpContext) {
    let cycle = await Cycle.findOrFail(request.param('id'))
    return await cycle.merge({ ...request.body() }).save()
  }

  async delete({ request }: HttpContext) {
    const user = await Cycle.findOrFail(request.param('id'))
    return await user.delete()
  }
}

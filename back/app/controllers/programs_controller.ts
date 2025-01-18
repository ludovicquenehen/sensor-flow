import type { HttpContext } from '@adonisjs/core/http'
import Program from '#models/program'
import User from '#models/user'

export default class ProgramsController {
  async index({ auth }: HttpContext) {
    const projectIds = (
      await User.query()
        .where('id', auth.user?.id || '')
        .preload('projects')
        .firstOrFail()
    ).projects.map((e) => e.toJSON().id)
    const programs = await Program.query().whereIn('projectId', projectIds)
    return programs.map((e: Program) => e.toJSON()) || []
  }

  async store({ request }: HttpContext) {
    return await Program.create({ ...request.body(), program: "" })
  }

  async get({ request }: HttpContext) {
    return await Program.findOrFail(request.param('id'))
  }

  async update({ request }: HttpContext) {
    let program = await Program.findOrFail(request.param('id'))
    return await program.merge({ ...request.body() }).save()
  }

  async delete({ request }: HttpContext) {
    const user = await Program.findOrFail(request.param('id'))
    return await user.delete()
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Project from '../models/project.js'

export default class ProjectsController {
  async index({ auth }: HttpContext) {
    return await Project.query().where('organizationId', auth.user?.organizationId || '')
  }

  async store({ auth, request }: HttpContext) {
    return await Project.create({ ...request.body(), organizationId: auth.user?.organizationId })
  }

  async delete({ request }: HttpContext) {
    const user = await Project.findOrFail(request.param('id'))
    return await user.delete()
  }
}

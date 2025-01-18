import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Project from '#models/project'

export default class UserProjectsController {
  async join({ request }: HttpContext) {
    const user = await User.findOrFail(request.param('id'))
    const project = await Project.findOrFail(request.param('projectId'))
    await user.related('projects').attach([project.id])
    await user.save()
    return user
  }

  async leave({ request }: HttpContext) {
    const user = await User.findOrFail(request.param('id'))
    const project = await Project.findOrFail(request.param('projectId'))
    await user.related('projects').detach([project.id])
    await user.save()
    return user
  }
}

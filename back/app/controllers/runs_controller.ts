import type { HttpContext } from '@adonisjs/core/http'
import Project from '../models/project.js'
import RunService, { runs } from '../services/run.js'

export default class RunsController {
  async getRunning() {
    return runs
  }

  async start({ request }: HttpContext) {
    const user = await Project.findOrFail(request.param('id'))
    return RunService.start(user.organizationId, request.param('id'))
  }

  async stop({ request }: HttpContext) {
    const user = await Project.findOrFail(request.param('id'))
    return RunService.stop(user.organizationId, request.param('id'))
  }
}

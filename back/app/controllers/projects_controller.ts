import type { HttpContext } from '@adonisjs/core/http'
import Project from '../models/project.js'
import Cycle from '../models/cycle.js'
import Program from '../models/program.js'
import Hardware from '../models/hardware.js'
import RunService from '../services/run.js'

export default class ProjectsController {
  async index({ auth }: HttpContext) {
    return await Project.query().where('organizationId', auth.user?.organizationId || '')
  }

  async find({ request }: HttpContext) {
    const project = await Project.query()
      .where('organizationId', request.param('organizationId'))
      .andWhere('id', request.param('id'))
      .firstOrFail()

    const hardwares = await Hardware.query().where('projectId', project.id)
    const programs = await Program.query().where('projectId', project.id)

    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const todayS = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`

    let cycle = await Cycle.query()
      .whereIn(
        'programId',
        programs.map((e) => e.toJSON().id)
      )
      .andWhere('start', '<=', todayS)
      .andWhere('end', '>', todayS)
      .firstOrFail()

    const program = await Program.findOrFail(cycle.programId)
    const cycleB = { ...cycle.toJSON, program }

    return { ...project.toJSON(), cycle: cycleB, hardwares: hardwares }
  }

  async store({ auth, request }: HttpContext) {
    return await Project.create({ ...request.body(), organizationId: auth.user?.organizationId })
  }

  async delete({ request }: HttpContext) {
    const user = await Project.findOrFail(request.param('id'))
    return await user.delete()
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

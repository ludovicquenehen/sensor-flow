import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import Flow from '../models/flow.js'

export default class FlowsController {
  async index({ auth }: HttpContext) {
    const projectIds = (
      await User.query()
        .where('id', auth.user?.id || '')
        .preload('projects')
        .firstOrFail()
    ).projects.map((e) => e.toJSON().id)
    const flows = await Flow.query().whereIn('projectId', projectIds)
    return flows.map((e: Flow) => ({ ...e.toJSON(), schema: JSON.parse(e.toJSON().schema) })) || []
  }

  async store({ request }: HttpContext) {
    return await Flow.create({ ...request.body() })
  }

  async get({ request }: HttpContext) {
    return await Flow.findOrFail(request.param('id'))
  }

  async update({ request }: HttpContext) {
    let flow = await Flow.findOrFail(request.param('id'))
    const { label, active, from, to, schema } = request.body()
    return await flow.merge({ label, active, from, to, schema: JSON.stringify(schema) }).save()
  }

  async delete({ request }: HttpContext) {
    const user = await Flow.findOrFail(request.param('id'))
    return await user.delete()
  }
}

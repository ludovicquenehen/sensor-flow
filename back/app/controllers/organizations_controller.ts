import type { HttpContext } from '@adonisjs/core/http'
import Organization from '../models/organization.js'

export default class OrganizationsController {
  async index({ auth }: HttpContext) {
    return await Organization.query().where('organizationId', auth.user?.organizationId || '')
  }

  async store({ request }: HttpContext) {
    return await Organization.create({ ...request.body() })
  }

  async delete({ request }: HttpContext) {
    const user = await Organization.findOrFail(request.param('id'))
    return await user.delete()
  }
}

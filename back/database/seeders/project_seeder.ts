import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Project from '../../app/models/project.js'

export default class extends BaseSeeder {
  async run() {
    await Project.createMany([{ id: 1, organizationId: "bc461107-93ad-46d8-89c4-84208b5097bd", label: 'Box 1' }]),
		await Project.createMany([{ id: 2, organizationId: "bc461107-93ad-46d8-89c4-84208b5097bd", label: 'Box 2' }])
  }
}

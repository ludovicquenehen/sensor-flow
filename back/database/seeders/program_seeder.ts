import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Program from '../../app/models/program.js'

export default class extends BaseSeeder {
  async run() {
    await Program.createMany([
      { id: 1, projectId: 1, label: 'Croissance' },
    ])
    await Program.createMany([
      { id: 2, projectId: 2, label: 'Croissance'},
    ])
  }
}

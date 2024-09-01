import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Cycle from '../../app/models/cycle.js'

export default class extends BaseSeeder {
  async run() {
    await Cycle.createMany([
      {
        programId: 1,
        label: 'Cycle',
        start: '2024-01-01',
        end: '2024-02-01',
      },
			{
        programId: 2,
        label: 'Cycle',
        start: '2024-01-01',
        end: '2024-02-01',
      },
    ])
  }
}

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hardware from '../../app/models/hardware.js'

export default class extends BaseSeeder {
  async run() {
    await Hardware.createMany([
      { projectId: 1, label: 'WeatherTemperature', type: 'SENSOR', api: '192.168.1.51/0' },
      { projectId: 1, label: 'WeatherHumidity', type: 'SENSOR', api: '192.168.1.51/1' },
      { projectId: 1, label: 'WaterTemperature', type: 'SENSOR', api: '192.168.1.52/0' },
      { projectId: 1, label: 'Light', type: 'ACTUATOR', api: '192.168.1.50/0' },
      { projectId: 1, label: 'RVK', type: 'ACTUATOR', api: '192.168.1.50/1' },
      { projectId: 1, label: 'Fan', type: 'ACTUATOR', api: '192.168.1.50/2' },
			{ projectId: 2, label: 'WeatherTemperature', type: 'SENSOR', api: '192.168.1.61/0' },
      { projectId: 2, label: 'WeatherHumidity', type: 'SENSOR', api: '192.168.1.61/1' },
      { projectId: 2, label: 'WaterTemperature', type: 'SENSOR', api: '192.168.1.62/0' },
      { projectId: 2, label: 'Light', type: 'ACTUATOR', api: '192.168.1.60/0' },
      { projectId: 2, label: 'RVK', type: 'ACTUATOR', api: '192.168.1.60/1' },
      { projectId: 2, label: 'Fan', type: 'ACTUATOR', api: '192.168.1.60/2' },
    ])
  }
}

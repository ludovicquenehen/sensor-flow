import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Project from './project.js'

type HARWARE_TYPE = 'SENSOR' | 'ACTUATOR' | 'SWITCH'

export default class Hardware extends BaseModel {
	static get table () {
    return 'hardwares'
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare label: string

  @column()
  declare api: string

  @column()
  declare type: HARWARE_TYPE

  @hasOne(() => Project)
  declare project: HasOne<typeof Project>

  @column()
  declare projectId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignId(hardware: Hardware) {
    hardware.id = uuidv4()
  }
}

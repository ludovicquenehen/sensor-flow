import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import Project from './project.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Flow extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

	@column()
  declare label: string

	@column()
  declare active: boolean

	@column()
  declare from: string

	@column()
  declare to: string

	@column()
  declare schema: Object

  @hasOne(() => Project)
  declare project: HasOne<typeof Project>

  @column()
  declare projectId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

	@beforeCreate()
  static assignId(hardware: Flow) {
    hardware.id = uuidv4()
  }
}
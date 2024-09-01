import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Project from './project.js'

export default class Program extends BaseModel {
  static get table() {
    return 'programs'
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string

  @hasOne(() => Project)
  declare project: HasOne<typeof Project>

  @column()
  declare projectId: number

  @column({
    serialize: (value: string) => JSON.parse(value),
  })
  declare program: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(program: Program) {
    program.program = JSON.stringify(program.$dirty.program)
  }
}

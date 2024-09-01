import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Program from './program.js'

export default class Cycle extends BaseModel {
	static get table () {
    return 'cycles'
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string

  @hasOne(() => Program)
  declare program: HasOne<typeof Program>

  @column()
  declare programId: number

	@column()
  declare start: string

	@column()
  declare end: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

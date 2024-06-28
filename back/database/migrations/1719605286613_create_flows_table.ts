import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'flows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
      table.string('label').notNullable()
      table.boolean('active').defaultTo(false)
      table.string('from')
      table.string('to')
			table.json('schema')
      table.integer('project_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

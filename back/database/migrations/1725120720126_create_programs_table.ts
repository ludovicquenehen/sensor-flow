import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
			table.string('label').notNullable()
      table.integer('project_id').notNullable()
			table.string('program').defaultTo('')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

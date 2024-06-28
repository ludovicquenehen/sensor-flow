import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hardwares'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id')
			table.string('label').notNullable()
			table.string('api').notNullable()
			table.string('type').notNullable()
			table.integer('project_id').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
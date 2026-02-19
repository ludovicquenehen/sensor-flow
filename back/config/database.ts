import { defineConfig } from '@adonisjs/lucid'
import env from '../start/env.js'

const dbConfig = defineConfig(/*{
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: env.get('SQLITE_FILE'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
}*/
{
  client: 'pg',
  connection: {
    connectionString: env.get('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: false,
    },
  },
  healthCheck: false,
  debug: false,
})

export default dbConfig

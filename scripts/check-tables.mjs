import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

async function checkTables() {
  const sql = neon(process.env.DATABASE_URL)

  console.log('Checking Neon database tables...\n')

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `

  console.log('Tables in database:')
  tables.forEach(t => console.log(`  ✅ ${t.table_name}`))

  console.log('\n--- Table Details ---\n')

  for (const t of tables) {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = ${t.table_name}
      ORDER BY ordinal_position
    `
    console.log(`📋 ${t.table_name}:`)
    columns.forEach(c => {
      console.log(`   - ${c.column_name} (${c.data_type})${c.is_nullable === 'NO' ? ' NOT NULL' : ''}`)
    })
    console.log('')
  }
}

checkTables().catch(console.error)

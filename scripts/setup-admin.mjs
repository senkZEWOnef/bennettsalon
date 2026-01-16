import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Define schema inline
const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login')
})

async function setupAdmin() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const db = drizzle(sql)

  const username = process.env.VITE_INITIAL_ADMIN_USERNAME || 'bennett'
  const password = process.env.VITE_INITIAL_ADMIN_PASSWORD || 'ChangeMeNow2024!'

  console.log('Checking existing admin accounts...')

  // Check existing admins
  const existingAdmins = await db.select().from(adminUsers)
  console.log(`Found ${existingAdmins.length} existing admin(s):`)
  existingAdmins.forEach(admin => {
    console.log(`  - ${admin.username} (id: ${admin.id})`)
  })

  // Delete old hardcoded accounts if they exist
  const oldAccounts = ['admin', 'backdoor', 'test']
  for (const oldUsername of oldAccounts) {
    const found = existingAdmins.find(a => a.username === oldUsername)
    if (found) {
      console.log(`Deleting old account: ${oldUsername}`)
      await db.delete(adminUsers).where(eq(adminUsers.username, oldUsername))
    }
  }

  // Check if new admin exists
  const newAdminExists = existingAdmins.find(a => a.username === username)
  if (newAdminExists) {
    console.log(`\nAdmin '${username}' already exists.`)
    console.log('Updating password...')
    const passwordHash = await bcrypt.hash(password, 10)
    await db.update(adminUsers)
      .set({ passwordHash })
      .where(eq(adminUsers.username, username))
    console.log('Password updated!')
  } else {
    console.log(`\nCreating new admin: ${username}`)
    const passwordHash = await bcrypt.hash(password, 10)
    await db.insert(adminUsers).values({
      username,
      passwordHash
    })
    console.log('Admin created successfully!')
  }

  console.log('\n✅ Done!')
  console.log(`\nLogin with:`)
  console.log(`  Username: ${username}`)
  console.log(`  Password: ${password}`)
}

setupAdmin().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})

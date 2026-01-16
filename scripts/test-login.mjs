import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login')
})

async function testLogin() {
  const sql = neon(process.env.DATABASE_URL)
  const db = drizzle(sql)

  const username = 'bennett'
  const password = 'ChangeMeNow2024!'

  console.log(`Testing login for: ${username}`)

  // Get admin from database
  const admins = await db.select().from(adminUsers).where(eq(adminUsers.username, username))

  if (admins.length === 0) {
    console.log('❌ User not found!')
    return
  }

  const admin = admins[0]
  console.log(`Found user: ${admin.username}`)
  console.log(`Password hash: ${admin.passwordHash}`)

  // Test password
  const isValid = await bcrypt.compare(password, admin.passwordHash)
  console.log(`Password valid: ${isValid ? '✅ YES' : '❌ NO'}`)
}

testLogin().catch(console.error)

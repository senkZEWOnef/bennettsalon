import { eq } from 'drizzle-orm'
import { db } from './connection'
import { adminUsers } from './schema'
import * as bcrypt from 'bcryptjs'

export const adminOperations = {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  },

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  },

  // Create admin user
  async createAdmin(username: string, password: string) {
    const passwordHash = await this.hashPassword(password)
    const [newAdmin] = await db.insert(adminUsers).values({
      username,
      passwordHash
    }).returning()
    return newAdmin
  },

  // Authenticate admin
  async authenticate(username: string, password: string) {
    const admin = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1)
    
    if (admin.length === 0) {
      return null
    }

    const isValid = await this.verifyPassword(password, admin[0].passwordHash)
    if (!isValid) {
      return null
    }

    // Update last login
    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, admin[0].id))

    return admin[0]
  },

  // Get all admins
  async getAllAdmins() {
    return await db.select({
      id: adminUsers.id,
      username: adminUsers.username,
      createdAt: adminUsers.createdAt,
      lastLogin: adminUsers.lastLogin
    }).from(adminUsers)
  },

  // Delete admin
  async deleteAdmin(id: number) {
    await db.delete(adminUsers).where(eq(adminUsers.id, id))
  },

  // Check if any admin accounts exist
  async hasAdminAccounts(): Promise<boolean> {
    const existingAdmins = await this.getAllAdmins()
    return existingAdmins.length > 0
  }
}
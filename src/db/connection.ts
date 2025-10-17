import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Get the database URL from environment variables
const getDatabaseUrl = (): string => {
  // In Vite, we need to access environment variables differently
  const url = import.meta.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  return url
}

// Create the connection
const sql = neon(getDatabaseUrl())

// Create the Drizzle instance
export const db = drizzle(sql, { schema })

// Export types
export type Database = typeof db
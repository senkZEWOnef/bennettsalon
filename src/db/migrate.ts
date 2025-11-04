import { db } from './connection'
import { sql } from 'drizzle-orm'

export async function runMigration() {
  try {
    console.log('🔄 Running database migration...')

    // Add totalPrice and notes columns to bookings table
    await db.execute(sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS total_price INTEGER,
      ADD COLUMN IF NOT EXISTS notes TEXT
    `)
    console.log('✅ Added total_price and notes columns to bookings table')

    // Add resumeFileContent column to job_applications table  
    await db.execute(sql`
      ALTER TABLE job_applications 
      ADD COLUMN IF NOT EXISTS resume_file_content TEXT
    `)
    console.log('✅ Added resume_file_content column to job_applications table')

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_total_price ON bookings(total_price)
    `)
    console.log('✅ Created index for bookings total_price')

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_resume_content 
      ON job_applications(resume_file_content) 
      WHERE resume_file_content IS NOT NULL
    `)
    console.log('✅ Created index for job_applications resume_file_content')

    // Verify the changes
    const bookingsColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
        AND column_name IN ('total_price', 'notes')
    `)
    console.log('📋 Bookings table columns added:', bookingsColumns)

    const jobApplicationsColumns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'job_applications' 
        AND column_name = 'resume_file_content'
    `)
    console.log('📋 Job applications table columns added:', jobApplicationsColumns)

    console.log('🎉 Database migration completed successfully!')
    return true

  } catch (error) {
    console.error('❌ Database migration failed:', error)
    return false
  }
}
-- Database Migration Script
-- Add new columns for price tracking and CV storage

-- Add totalPrice and notes columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS total_price INTEGER,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add resumeFileContent column to job_applications table  
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS resume_file_content TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_total_price ON bookings(total_price);
CREATE INDEX IF NOT EXISTS idx_job_applications_resume_content ON job_applications(resume_file_content) WHERE resume_file_content IS NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
  AND column_name IN ('total_price', 'notes');

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
  AND column_name = 'resume_file_content';
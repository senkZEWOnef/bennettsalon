import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'

// Bookings table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  time: text('time').notNull(),
  service: text('service').notNull(),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  clientPhone: text('client_phone').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'cancelled'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paymentDeadline: timestamp('payment_deadline'),
  paymentMethod: text('payment_method'), // 'ath' | 'admin_override'
  depositAmount: integer('deposit_amount').default(25)
})

// Gallery images table
export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  src: text('src').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Manicura' | 'Pedicura' | 'Especial'
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow()
})

// Schedule settings table (stores the admin's schedule configuration)
export const scheduleSettings = pgTable('schedule_settings', {
  id: serial('id').primaryKey(),
  availableDays: jsonb('available_days').notNull(), // array of numbers [1,2,3,4,5]
  availableHours: jsonb('available_hours').notNull(), // array of strings
  blockedDates: jsonb('blocked_dates').notNull(), // array of date strings
  yearSchedule: jsonb('year_schedule').notNull(), // array of DaySchedule objects
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// WhatsApp settings table
export const whatsappSettings = pgTable('whatsapp_settings', {
  id: serial('id').primaryKey(),
  adminNumber: text('admin_number').notNull(),
  businessName: text('business_name').notNull(),
  businessAddress: text('business_address').notNull(),
  enableNotifications: boolean('enable_notifications').notNull().default(true),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Admin authentication table (for future multi-admin support)
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastLogin: timestamp('last_login')
})

// Types for TypeScript
export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert

export type GalleryImage = typeof galleryImages.$inferSelect
export type NewGalleryImage = typeof galleryImages.$inferInsert

export type ScheduleSettings = typeof scheduleSettings.$inferSelect
export type NewScheduleSettings = typeof scheduleSettings.$inferInsert

export type WhatsAppSettings = typeof whatsappSettings.$inferSelect
export type NewWhatsAppSettings = typeof whatsappSettings.$inferInsert

export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert
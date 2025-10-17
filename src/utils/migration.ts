import { ApiService } from '../services/api'

export interface LocalStorageBooking {
  id: string
  date: string // ISO string
  time: string
  service: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string // ISO string
  paymentDeadline?: string // ISO string
  paymentMethod?: 'ath' | 'admin_override'
  depositAmount?: number
}

export interface LocalStorageGalleryImage {
  id: string
  src: string
  title: string
  category: 'Manicura' | 'Pedicura' | 'Especial'
  uploadedAt: string // ISO string
}

export class DataMigration {
  static async migrateFromLocalStorage(): Promise<{
    success: boolean
    migratedBookings: number
    migratedImages: number
    migratedSettings: boolean
    errors: string[]
  }> {
    const errors: string[] = []
    let migratedBookings = 0
    let migratedImages = 0
    let migratedSettings = false

    try {
      console.log('Starting migration from localStorage to Neon database...')

      // 1. Migrate bookings
      const savedBookings = localStorage.getItem('adminBookings')
      if (savedBookings) {
        try {
          const bookings: LocalStorageBooking[] = JSON.parse(savedBookings)
          console.log(`Found ${bookings.length} bookings to migrate`)

          for (const booking of bookings) {
            try {
              await ApiService.createBooking({
                date: new Date(booking.date),
                time: booking.time,
                service: booking.service,
                clientName: booking.clientName,
                clientEmail: booking.clientEmail,
                clientPhone: booking.clientPhone,
                status: booking.status,
                paymentMethod: booking.paymentMethod,
                depositAmount: booking.depositAmount
              })
              migratedBookings++
            } catch (error) {
              errors.push(`Failed to migrate booking ${booking.id}: ${error}`)
            }
          }
        } catch (error) {
          errors.push(`Failed to parse bookings from localStorage: ${error}`)
        }
      }

      // 2. Migrate gallery images
      const savedGallery = localStorage.getItem('adminGallery')
      if (savedGallery) {
        try {
          const images: LocalStorageGalleryImage[] = JSON.parse(savedGallery)
          console.log(`Found ${images.length} gallery images to migrate`)

          for (const image of images) {
            try {
              await ApiService.createGalleryImage({
                src: image.src,
                title: image.title,
                category: image.category
              })
              migratedImages++
            } catch (error) {
              errors.push(`Failed to migrate image ${image.id}: ${error}`)
            }
          }
        } catch (error) {
          errors.push(`Failed to parse gallery from localStorage: ${error}`)
        }
      }

      // 3. Migrate schedule settings
      const savedSchedule = localStorage.getItem('adminSchedule')
      if (savedSchedule) {
        try {
          const scheduleSettings = JSON.parse(savedSchedule)
          await ApiService.updateScheduleSettings(scheduleSettings)
          migratedSettings = true
          console.log('Schedule settings migrated successfully')
        } catch (error) {
          errors.push(`Failed to migrate schedule settings: ${error}`)
        }
      }

      // 4. Migrate WhatsApp settings
      const savedWhatsApp = localStorage.getItem('adminWhatsApp')
      if (savedWhatsApp) {
        try {
          const whatsappSettings = JSON.parse(savedWhatsApp)
          await ApiService.updateWhatsAppSettings(whatsappSettings)
          console.log('WhatsApp settings migrated successfully')
        } catch (error) {
          errors.push(`Failed to migrate WhatsApp settings: ${error}`)
        }
      }

      console.log('Migration completed!')
      console.log(`Migrated: ${migratedBookings} bookings, ${migratedImages} images`)
      
      return {
        success: errors.length === 0,
        migratedBookings,
        migratedImages,
        migratedSettings,
        errors
      }

    } catch (error) {
      errors.push(`Migration failed: ${error}`)
      return {
        success: false,
        migratedBookings,
        migratedImages,
        migratedSettings,
        errors
      }
    }
  }

  static async createBackupOfLocalStorage(): Promise<{
    bookings: LocalStorageBooking[]
    gallery: LocalStorageGalleryImage[]
    schedule: any
    whatsapp: any
  }> {
    const backup = {
      bookings: [],
      gallery: [],
      schedule: null,
      whatsapp: null
    }

    try {
      const savedBookings = localStorage.getItem('adminBookings')
      if (savedBookings) {
        backup.bookings = JSON.parse(savedBookings)
      }

      const savedGallery = localStorage.getItem('adminGallery')
      if (savedGallery) {
        backup.gallery = JSON.parse(savedGallery)
      }

      const savedSchedule = localStorage.getItem('adminSchedule')
      if (savedSchedule) {
        backup.schedule = JSON.parse(savedSchedule)
      }

      const savedWhatsApp = localStorage.getItem('adminWhatsApp')
      if (savedWhatsApp) {
        backup.whatsapp = JSON.parse(savedWhatsApp)
      }
    } catch (error) {
      console.error('Error creating backup:', error)
    }

    return backup
  }

  static async clearLocalStorageData(): Promise<void> {
    console.log('Clearing localStorage data after successful migration...')
    localStorage.removeItem('adminBookings')
    localStorage.removeItem('adminGallery')
    localStorage.removeItem('adminSchedule')
    localStorage.removeItem('adminWhatsApp')
    // Keep authentication status
    console.log('localStorage data cleared (except authentication)')
  }

  static async runMigration(): Promise<void> {
    try {
      // Create backup first
      console.log('Creating backup of localStorage data...')
      const backup = await this.createBackupOfLocalStorage()
      
      // Save backup to sessionStorage as safety net
      sessionStorage.setItem('migrationBackup', JSON.stringify({
        timestamp: new Date().toISOString(),
        data: backup
      }))

      // Run migration
      const result = await this.migrateFromLocalStorage()
      
      if (result.success) {
        console.log('✅ Migration successful!')
        console.log(`Migrated ${result.migratedBookings} bookings and ${result.migratedImages} images`)
        
        // Clear localStorage after successful migration
        await this.clearLocalStorageData()
        
        // Mark migration as completed
        localStorage.setItem('migrationCompleted', 'true')
        
        alert(`Migration completed successfully!\n\nMigrated:\n- ${result.migratedBookings} bookings\n- ${result.migratedImages} gallery images\n- Settings: ${result.migratedSettings ? 'Yes' : 'No'}`)
      } else {
        console.error('❌ Migration failed!')
        console.error('Errors:', result.errors)
        alert(`Migration failed with errors:\n\n${result.errors.join('\n')}\n\nPlease check the console for details.`)
      }
    } catch (error) {
      console.error('Migration process failed:', error)
      alert(`Migration process failed: ${error}`)
    }
  }

  static hasMigrationCompleted(): boolean {
    return localStorage.getItem('migrationCompleted') === 'true'
  }

  static hasLocalStorageData(): boolean {
    return !!(
      localStorage.getItem('adminBookings') ||
      localStorage.getItem('adminGallery') ||
      localStorage.getItem('adminSchedule') ||
      localStorage.getItem('adminWhatsApp')
    )
  }
}
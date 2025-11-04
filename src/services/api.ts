import { bookingOperations, galleryOperations, scheduleOperations, whatsappOperations, serviceOperations, jobApplicationOperations } from '../db/operations'
import { adminOperations } from '../db/adminOperations'
import type { NewBooking, NewGalleryImage } from '../db/schema'

// Type mappings to match existing AdminContext interfaces
export interface BookingData {
  date: Date
  time: string
  service: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentMethod?: 'ath' | 'admin_override'
  depositAmount?: number
  totalPrice?: number
  notes?: string
}

export interface GalleryImageData {
  src: string
  title: string
  category: 'Manicura' | 'Pedicura' | 'Especial'
}

export interface ScheduleSettingsData {
  availableDays: number[]
  availableHours: string[]
  blockedDates: string[]
  yearSchedule: any[]
}

export interface WhatsAppSettingsData {
  adminNumber: string
  businessName: string
  businessAddress: string
  enableNotifications: boolean
}

// API service class
export class ApiService {
  // Booking methods
  static async getBookings() {
    try {
      const dbBookings = await bookingOperations.getAll()
      // Transform database bookings to match AdminContext format
      return dbBookings.map(booking => ({
        id: booking.id.toString(),
        date: new Date(booking.date),
        time: booking.time,
        service: booking.service,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
        createdAt: new Date(booking.createdAt),
        paymentDeadline: booking.paymentDeadline ? new Date(booking.paymentDeadline) : undefined,
        paymentMethod: booking.paymentMethod as 'ath' | 'admin_override' | undefined,
        depositAmount: booking.depositAmount || undefined,
        totalPrice: booking.totalPrice || undefined,
        notes: booking.notes || undefined
      }))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  }

  static async createBooking(data: Omit<BookingData, 'id' | 'createdAt' | 'paymentDeadline'>) {
    try {
      const now = new Date()
      const paymentDeadline = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now
      
      const newBooking: NewBooking = {
        date: data.date,
        time: data.time,
        service: data.service,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        status: data.status,
        paymentDeadline,
        paymentMethod: data.paymentMethod,
        depositAmount: data.depositAmount || 25
      }
      
      const created = await bookingOperations.create(newBooking)
      return created.id.toString()
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  static async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled', paymentMethod?: string) {
    try {
      return await bookingOperations.updateStatus(parseInt(id), status, paymentMethod)
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  static async updateBookingPrice(id: string, totalPrice: number, notes?: string) {
    try {
      return await bookingOperations.updatePrice(parseInt(id), totalPrice, notes)
    } catch (error) {
      console.error('Error updating booking price:', error)
      throw error
    }
  }

  static async deleteBooking(id: string) {
    try {
      return await bookingOperations.delete(parseInt(id))
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }

  // Gallery methods
  static async getGalleryImages() {
    try {
      const dbImages = await galleryOperations.getAll()
      return dbImages.map(image => ({
        id: image.id.toString(),
        src: image.src,
        title: image.title,
        category: image.category as 'Manicura' | 'Pedicura' | 'Especial',
        uploadedAt: new Date(image.uploadedAt)
      }))
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      return []
    }
  }

  static async createGalleryImage(data: GalleryImageData) {
    try {
      const newImage: NewGalleryImage = {
        src: data.src,
        title: data.title,
        category: data.category
      }
      
      return await galleryOperations.create(newImage)
    } catch (error) {
      console.error('Error creating gallery image:', error)
      throw error
    }
  }

  static async deleteGalleryImage(id: string) {
    try {
      return await galleryOperations.delete(parseInt(id))
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      throw error
    }
  }

  static async resetGalleryToDefaults() {
    try {
      const images = await galleryOperations.resetToDefaults()
      return images.map(image => ({
        id: image.id.toString(),
        src: image.src,
        title: image.title,
        category: image.category as 'Manicura' | 'Pedicura' | 'Especial',
        uploadedAt: new Date(image.uploadedAt)
      }))
    } catch (error) {
      console.error('Error resetting gallery:', error)
      throw error
    }
  }

  // Schedule methods
  static async getScheduleSettings() {
    try {
      const settings = await scheduleOperations.get()
      if (!settings) {
        // Return default settings if none exist
        return {
          availableDays: [1, 2, 3, 4, 5],
          availableHours: [
            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
          ],
          blockedDates: [],
          yearSchedule: []
        }
      }
      return {
        availableDays: settings.availableDays as number[],
        availableHours: settings.availableHours as string[],
        blockedDates: settings.blockedDates as string[],
        yearSchedule: settings.yearSchedule as any[]
      }
    } catch (error) {
      console.error('Error fetching schedule settings:', error)
      return {
        availableDays: [1, 2, 3, 4, 5],
        availableHours: [
          '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
          '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
        ],
        blockedDates: [],
        yearSchedule: []
      }
    }
  }

  static async updateScheduleSettings(data: ScheduleSettingsData) {
    try {
      return await scheduleOperations.update(data)
    } catch (error) {
      console.error('Error updating schedule settings:', error)
      throw error
    }
  }

  // WhatsApp methods
  static async getWhatsAppSettings() {
    try {
      const settings = await whatsappOperations.get()
      if (!settings) {
        return {
          adminNumber: '17878682382',
          businessName: 'Bennett Salon de Beauté',
          businessAddress: 'Aguada, Puerto Rico',
          enableNotifications: true
        }
      }
      return {
        adminNumber: settings.adminNumber,
        businessName: settings.businessName,
        businessAddress: settings.businessAddress,
        enableNotifications: settings.enableNotifications
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error)
      return {
        adminNumber: '17878682382',
        businessName: 'Bennett Salon de Beauté',
        businessAddress: 'Aguada, Puerto Rico',
        enableNotifications: true
      }
    }
  }

  static async updateWhatsAppSettings(data: WhatsAppSettingsData) {
    try {
      return await whatsappOperations.update(data)
    } catch (error) {
      console.error('Error updating WhatsApp settings:', error)
      throw error
    }
  }

  // Cleanup method
  static async cleanupExpiredBookings() {
    try {
      return await bookingOperations.cleanup()
    } catch (error) {
      console.error('Error cleaning up expired bookings:', error)
    }
  }

  // Admin authentication methods
  static async authenticateAdmin(username: string, password: string) {
    try {
      const admin = await adminOperations.authenticate(username, password)
      if (admin) {
        return {
          success: true,
          admin: {
            id: admin.id,
            username: admin.username,
            lastLogin: admin.lastLogin
          }
        }
      }
      return { success: false, admin: null }
    } catch (error) {
      console.error('Error authenticating admin:', error)
      return { success: false, admin: null }
    }
  }

  static async getAllAdmins() {
    try {
      return await adminOperations.getAllAdmins()
    } catch (error) {
      console.error('Error fetching admin users:', error)
      return []
    }
  }

  static async createAdmin(username: string, password: string) {
    try {
      return await adminOperations.createAdmin(username, password)
    } catch (error) {
      console.error('Error creating admin:', error)
      throw error
    }
  }

  static async initializeAdmins() {
    try {
      return await adminOperations.initializeDefaultAdmins()
    } catch (error) {
      console.error('Error initializing admin accounts:', error)
      throw error
    }
  }

  // Service methods
  static async getServices() {
    try {
      const dbServices = await serviceOperations.getAll()
      return dbServices.map(service => ({
        id: service.id.toString(),
        name: service.name,
        category: service.category as 'Manicura' | 'Pedicura' | 'Especial' | 'Combo',
        isActive: service.isActive,
        createdAt: new Date(service.createdAt)
      }))
    } catch (error) {
      console.error('Error fetching services:', error)
      return []
    }
  }

  static async getActiveServices() {
    try {
      const dbServices = await serviceOperations.getActive()
      return dbServices.map(service => ({
        id: service.id.toString(),
        name: service.name,
        category: service.category as 'Manicura' | 'Pedicura' | 'Especial' | 'Combo',
        isActive: service.isActive,
        createdAt: new Date(service.createdAt)
      }))
    } catch (error) {
      console.error('Error fetching active services:', error)
      return []
    }
  }

  static async createService(data: { name: string; category: 'Manicura' | 'Pedicura' | 'Especial' | 'Combo'; isActive: boolean }) {
    try {
      const created = await serviceOperations.create(data)
      return created.id.toString()
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  }

  static async updateService(id: string, data: Partial<{ name: string; category: 'Manicura' | 'Pedicura' | 'Especial' | 'Combo'; isActive: boolean }>) {
    try {
      return await serviceOperations.update(parseInt(id), data)
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  static async deleteService(id: string) {
    try {
      return await serviceOperations.delete(parseInt(id))
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  }

  static async initializeServices() {
    try {
      return await serviceOperations.initializeDefaults()
    } catch (error) {
      console.error('Error initializing services:', error)
      throw error
    }
  }

  // Job application methods
  static async getJobApplications() {
    try {
      const dbApplications = await jobApplicationOperations.getAll()
      return dbApplications.map(app => ({
        id: app.id.toString(),
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        applicantPhone: app.applicantPhone,
        position: app.position,
        experience: app.experience || '',
        coverLetter: app.coverLetter || '',
        resumeFileName: app.resumeFileName || '',
        resumeFileSize: app.resumeFileSize || 0,
        resumeFileContent: app.resumeFileContent || undefined,
        status: app.status as 'pending' | 'reviewed' | 'contacted' | 'hired' | 'rejected',
        notes: app.notes || '',
        createdAt: new Date(app.createdAt),
        reviewedAt: app.reviewedAt ? new Date(app.reviewedAt) : null
      }))
    } catch (error) {
      console.error('Error fetching job applications:', error)
      return []
    }
  }

  static async createJobApplication(data: {
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    position: string
    experience?: string
    coverLetter?: string
    resumeFileName?: string
    resumeFileSize?: number
    resumeFileContent?: string
  }) {
    try {
      const created = await jobApplicationOperations.create(data)
      return created.id.toString()
    } catch (error) {
      console.error('Error creating job application:', error)
      throw error
    }
  }

  static async updateJobApplicationStatus(id: string, status: 'pending' | 'reviewed' | 'contacted' | 'hired' | 'rejected', notes?: string) {
    try {
      return await jobApplicationOperations.updateStatus(parseInt(id), status, notes)
    } catch (error) {
      console.error('Error updating job application status:', error)
      throw error
    }
  }

  static async addJobApplicationNotes(id: string, notes: string) {
    try {
      return await jobApplicationOperations.addNotes(parseInt(id), notes)
    } catch (error) {
      console.error('Error adding job application notes:', error)
      throw error
    }
  }

  static async deleteJobApplication(id: string) {
    try {
      return await jobApplicationOperations.delete(parseInt(id))
    } catch (error) {
      console.error('Error deleting job application:', error)
      throw error
    }
  }

  static async getJobApplicationStats() {
    try {
      return await jobApplicationOperations.getStats()
    } catch (error) {
      console.error('Error fetching job application stats:', error)
      return {
        total: 0,
        pending: 0,
        reviewed: 0,
        contacted: 0,
        hired: 0,
        rejected: 0
      }
    }
  }
}
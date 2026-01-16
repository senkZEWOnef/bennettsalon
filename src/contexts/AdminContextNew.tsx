import React, { createContext, useContext, useState, useEffect } from 'react'
import { triggerWhatsAppNotifications } from '../utils/whatsapp'
import { ApiService } from '../services/api'
import { runMigration } from '../db/migrate'

export interface Booking {
  id: string
  date: Date
  time: string
  service: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
  paymentDeadline?: Date
  paymentMethod?: 'ath' | 'admin_override'
  depositAmount?: number
  totalPrice?: number // Total amount charged for the service in cents
  notes?: string // Admin notes about the booking
}

export interface GalleryImage {
  id: string
  src: string
  title: string
  category: 'Manicura' | 'Pedicura' | 'Especial'
  uploadedAt: Date
}

export interface TimeSlot {
  time: string // "08:00", "08:30", etc.
  available: boolean
}

export interface DaySchedule {
  date: string // "2024-01-15"
  isOpen: boolean
  timeSlots: TimeSlot[]
}

export interface ScheduleSettings {
  // Legacy support
  availableDays: number[]
  availableHours: string[]
  blockedDates: string[]
  // New comprehensive calendar system
  yearSchedule: DaySchedule[]
}

export interface WhatsAppSettings {
  adminNumber: string
  businessName: string
  businessAddress: string
  enableNotifications: boolean
}

export interface Service {
  id: string
  name: string
  category: 'Manicura' | 'Pedicura' | 'Especial' | 'Combo'
  isActive: boolean
  createdAt: Date
}

interface AdminContextType {
  isAuthenticated: boolean
  currentAdmin: { id: number; username: string; lastLogin: Date | null } | null
  bookings: Booking[]
  galleryImages: GalleryImage[]
  scheduleSettings: ScheduleSettings
  whatsappSettings: WhatsAppSettings
  services: Service[]
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  loginLegacy: (password: string) => boolean
  logout: () => void
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'paymentDeadline'>) => Promise<string>
  updateBookingStatus: (id: string, status: Booking['status'], paymentMethod?: string) => Promise<void>
  updateBookingPrice: (id: string, totalPrice: number, notes?: string) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
  confirmBookingManually: (id: string) => Promise<void>
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => Promise<void>
  removeGalleryImage: (id: string) => Promise<void>
  resetGalleryToDefaults: () => Promise<void>
  updateScheduleSettings: (settings: ScheduleSettings) => Promise<void>
  updateWhatsAppSettings: (settings: WhatsAppSettings) => Promise<void>
  cleanupExpiredBookings: () => Promise<void>
  // New calendar management methods
  updateTimeSlot: (date: string, time: string, available: boolean) => Promise<void>
  updateDayStatus: (date: string, isOpen: boolean) => Promise<void>
  updateMultipleDays: (dates: string[], isOpen: boolean) => void
  updateTimeSlotBulk: (dates: string[], timeSlots: string[], available: boolean) => Promise<void>
  generateDefaultSchedule: (year: number) => void
  isTimeSlotAvailable: (date: string, time: string) => boolean
  // Service management methods
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => Promise<void>
  updateService: (id: string, updates: Partial<Service>) => Promise<void>
  deleteService: (id: string) => Promise<void>
  getActiveServices: () => Service[]
  // Data loading method
  loadData: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [currentAdmin, setCurrentAdmin] = useState<{ id: number; username: string; lastLogin: Date | null } | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  // Generate time slots from 6am to 9pm in 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break // Stop at 9:00 PM
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({ time, available: true }) // Default to open
      }
    }
    return slots
  }

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    availableHours: [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ],
    blockedDates: [],
    yearSchedule: [] // Will be initialized in useEffect
  })

  const [whatsappSettings, setWhatsAppSettings] = useState<WhatsAppSettings>({
    adminNumber: '17878682382',
    businessName: 'Bennett Salon de Beauté',
    businessAddress: 'Aguada, Puerto Rico',
    enableNotifications: true
  })

  // Initialize default services
  const initializeDefaultServices = (): Service[] => {
    return [
      { id: '1', name: 'Manicura Clásica', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '2', name: 'Manicura en Gel', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '3', name: 'Manicura Rusa', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '4', name: 'Diseños Personalizados', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '5', name: 'Gel Tips', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '6', name: 'Hard Gel', category: 'Manicura', isActive: true, createdAt: new Date() },
      { id: '7', name: 'Pedicura Clásica', category: 'Pedicura', isActive: true, createdAt: new Date() },
      { id: '8', name: 'Pedicura Spa', category: 'Pedicura', isActive: true, createdAt: new Date() },
      { id: '9', name: 'Combo Manicura & Pedicura', category: 'Combo', isActive: true, createdAt: new Date() },
      { id: '10', name: 'Tratamiento Especial', category: 'Especial', isActive: true, createdAt: new Date() }
    ]
  }

  // Load data from database
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Check if DATABASE_URL is available
      if (!import.meta.env.DATABASE_URL && !import.meta.env.VITE_DATABASE_URL) {
        console.warn('DATABASE_URL not configured, running in offline mode')
        setLoading(false)
        return
      }
      
      // Run database migration to ensure schema is up to date
      await runMigration()
      
      // Check if admin accounts exist (admins must be created manually for security)
      const hasAdmins = await ApiService.checkAdminAccountsExist()
      if (!hasAdmins) {
        console.warn('No admin accounts found. Please create an admin account using the database.')
      }
      
      // Initialize services first
      await ApiService.initializeServices()
      
      // Load all data in parallel
      const [
        dbBookings,
        dbGalleryImages,
        dbScheduleSettings,
        dbWhatsAppSettings,
        dbServices
      ] = await Promise.all([
        ApiService.getBookings(),
        ApiService.getGalleryImages(),
        ApiService.getScheduleSettings(),
        ApiService.getWhatsAppSettings(),
        ApiService.getServices()
      ])

      setBookings(dbBookings)
      setGalleryImages(dbGalleryImages)
      setScheduleSettings(dbScheduleSettings)
      setWhatsAppSettings(dbWhatsAppSettings)
      setServices(dbServices)

    } catch (error) {
      console.error('Error loading data from database:', error)
      console.warn('Database connection failed, running in offline mode')
      // Fall back to localStorage if database fails
      const authStatus = localStorage.getItem('adminAuthenticated')
      if (authStatus === 'true') {
        setIsAuthenticated(true)
      }
      
      // Initialize with default data when database is unavailable
      const defaultGalleryImages = [
        { id: '1', src: '/images/gallery/manicures/manicure2.jpg', title: 'Diseño Elegante de Manicura', category: 'Manicura' as const, uploadedAt: new Date() },
        { id: '2', src: '/images/gallery/manicures/manicure3.jpg', title: 'Arte Creativo en Uñas', category: 'Manicura' as const, uploadedAt: new Date() },
        { id: '3', src: '/images/gallery/pedicures/pedicure-classic.JPG', title: 'Pedicura Clásica', category: 'Pedicura' as const, uploadedAt: new Date() }
      ]
      setGalleryImages(defaultGalleryImages)
      
      // Initialize default services when database is unavailable
      setServices(initializeDefaultServices())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check authentication from localStorage (for now)
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    
    // Load initial data
    loadData()
  }, [])

  // New database-based login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await ApiService.authenticateAdmin(username, password)
      if (result.success && result.admin) {
        setIsAuthenticated(true)
        setCurrentAdmin(result.admin)
        localStorage.setItem('adminAuthenticated', 'true')
        localStorage.setItem('currentAdmin', JSON.stringify(result.admin))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Legacy login - disabled for security (use database authentication instead)
  const loginLegacy = (_password: string): boolean => {
    console.warn('Legacy login is disabled. Please use database authentication with username and password.')
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentAdmin(null)
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('currentAdmin')
  }

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'paymentDeadline'>): Promise<string> => {
    try {
      const bookingId = await ApiService.createBooking(bookingData)
      // Reload bookings to get the updated list
      const updatedBookings = await ApiService.getBookings()
      setBookings(updatedBookings)
      return bookingId
    } catch (error) {
      console.error('Error adding booking:', error)
      // Fallback to local state if database fails
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date(),
        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
      setBookings(prev => [...prev, newBooking])
      throw new Error('Database unavailable. Booking created locally but may not persist.')
    }
  }

  const updateBookingStatus = async (id: string, status: Booking['status'], paymentMethod?: string) => {
    try {
      await ApiService.updateBookingStatus(id, status, paymentMethod)
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => {
          if (booking.id === id) {
            const updatedBooking = { 
              ...booking, 
              status,
              paymentMethod: paymentMethod as any,
              paymentDeadline: status === 'confirmed' ? undefined : booking.paymentDeadline
            }
            
            // Send WhatsApp notifications when booking is confirmed
            if (status === 'confirmed' && whatsappSettings.enableNotifications) {
              const bookingDetails = {
                clientName: updatedBooking.clientName,
                clientPhone: updatedBooking.clientPhone,
                service: updatedBooking.service,
                date: updatedBooking.date,
                time: updatedBooking.time,
                bookingId: updatedBooking.id
              }
              
              // Trigger WhatsApp notifications with a small delay to ensure state update
              setTimeout(() => {
                const whatsappConfig = {
                  adminNumber: whatsappSettings.adminNumber,
                  businessName: whatsappSettings.businessName,
                  businessAddress: whatsappSettings.businessAddress
                }
                triggerWhatsAppNotifications(bookingDetails, whatsappConfig)
              }, 1000)
            }
            
            return updatedBooking
          }
          return booking
        })
      )
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  const updateBookingPrice = async (id: string, totalPrice: number, notes?: string) => {
    try {
      await ApiService.updateBookingPrice(id, totalPrice, notes)
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id 
            ? { ...booking, totalPrice, notes }
            : booking
        )
      )
    } catch (error) {
      console.error('Error updating booking price:', error)
      throw error
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      await ApiService.deleteBooking(id)
      
      // Remove from local state
      setBookings(prev => prev.filter(booking => booking.id !== id))
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }

  const confirmBookingManually = async (id: string) => {
    await updateBookingStatus(id, 'confirmed', 'admin_override')
  }

  const cleanupExpiredBookings = async () => {
    try {
      await ApiService.cleanupExpiredBookings()
      // Reload bookings to get updated state
      const updatedBookings = await ApiService.getBookings()
      setBookings(updatedBookings)
    } catch (error) {
      console.error('Error cleaning up expired bookings:', error)
    }
  }

  const addGalleryImage = async (imageData: Omit<GalleryImage, 'id' | 'uploadedAt'>) => {
    try {
      await ApiService.createGalleryImage(imageData)
      // Reload gallery images
      const updatedImages = await ApiService.getGalleryImages()
      setGalleryImages(updatedImages)
    } catch (error) {
      console.error('Error adding gallery image:', error)
      throw error
    }
  }

  const removeGalleryImage = async (id: string) => {
    try {
      await ApiService.deleteGalleryImage(id)
      // Update local state
      setGalleryImages(prev => prev.filter(image => image.id !== id))
    } catch (error) {
      console.error('Error removing gallery image:', error)
      throw error
    }
  }

  const resetGalleryToDefaults = async () => {
    try {
      const defaultImages = await ApiService.resetGalleryToDefaults()
      setGalleryImages(defaultImages)
    } catch (error) {
      console.error('Error resetting gallery:', error)
      throw error
    }
  }

  const updateScheduleSettings = async (settings: ScheduleSettings) => {
    try {
      await ApiService.updateScheduleSettings(settings)
      setScheduleSettings(settings)
    } catch (error) {
      console.error('Error updating schedule settings:', error)
      throw error
    }
  }

  const updateWhatsAppSettings = async (settings: WhatsAppSettings) => {
    try {
      await ApiService.updateWhatsAppSettings(settings)
      setWhatsAppSettings(settings)
    } catch (error) {
      console.error('Error updating WhatsApp settings:', error)
      throw error
    }
  }

  // Service management methods
  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    try {
      await ApiService.createService(serviceData)
      // Reload services to get updated list
      const updatedServices = await ApiService.getServices()
      setServices(updatedServices)
    } catch (error) {
      console.error('Error adding service:', error)
      // Fallback to local state if database fails
      const newService: Service = {
        ...serviceData,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      setServices(prev => [...prev, newService])
      throw new Error('Database unavailable. Service created locally but may not persist.')
    }
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      await ApiService.updateService(id, updates)
      // Update local state
      setServices(prev => 
        prev.map(service => 
          service.id === id ? { ...service, ...updates } : service
        )
      )
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  const deleteService = async (id: string) => {
    try {
      await ApiService.deleteService(id)
      // Update local state
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  }

  const getActiveServices = (): Service[] => {
    return services.filter(service => service.isActive)
  }

  // Calendar management methods (local state for now, should be moved to database later)
  const generateDefaultSchedule = (year: number) => {
    const schedule: DaySchedule[] = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0]
      
      schedule.push({
        date: dateString,
        isOpen: true, // Default to open
        timeSlots: generateTimeSlots()
      })
    }
    
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: schedule
    }))
  }

  const updateTimeSlot = async (date: string, time: string, available: boolean) => {
    const updatedSettings = {
      ...scheduleSettings,
      yearSchedule: scheduleSettings.yearSchedule.map(day => 
        day.date === date 
          ? {
              ...day,
              timeSlots: day.timeSlots.map(slot =>
                slot.time === time ? { ...slot, available } : slot
              )
            }
          : day
      )
    }
    
    // Update local state immediately for responsiveness
    setScheduleSettings(updatedSettings)
    
    // Save to database
    try {
      await ApiService.updateScheduleSettings(updatedSettings)
    } catch (error) {
      console.error('Error saving time slot update:', error)
      // Revert local state on error
      setScheduleSettings(scheduleSettings)
    }
  }

  const updateDayStatus = async (date: string, isOpen: boolean) => {
    const updatedSettings = {
      ...scheduleSettings,
      yearSchedule: scheduleSettings.yearSchedule.map(day => 
        day.date === date 
          ? {
              ...day,
              isOpen,
              timeSlots: day.timeSlots.map(slot => ({ ...slot, available: isOpen }))
            }
          : day
      )
    }
    
    // Update local state immediately for responsiveness
    setScheduleSettings(updatedSettings)
    
    // Save to database
    try {
      await ApiService.updateScheduleSettings(updatedSettings)
    } catch (error) {
      console.error('Error saving day status update:', error)
      // Revert local state on error
      setScheduleSettings(scheduleSettings)
    }
  }

  const updateMultipleDays = (dates: string[], isOpen: boolean) => {
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: prev.yearSchedule.map(day => 
        dates.includes(day.date)
          ? {
              ...day,
              isOpen,
              timeSlots: day.timeSlots.map(slot => ({ ...slot, available: isOpen }))
            }
          : day
      )
    }))
  }

  const updateTimeSlotBulk = async (dates: string[], timeSlots: string[], available: boolean) => {
    const updatedSettings = {
      ...scheduleSettings,
      yearSchedule: scheduleSettings.yearSchedule.map(day => 
        dates.includes(day.date)
          ? {
              ...day,
              timeSlots: day.timeSlots.map(slot =>
                timeSlots.includes(slot.time) ? { ...slot, available } : slot
              )
            }
          : day
      )
    }
    
    // Update local state immediately for responsiveness
    setScheduleSettings(updatedSettings)
    
    // Save to database
    try {
      await ApiService.updateScheduleSettings(updatedSettings)
    } catch (error) {
      console.error('Error saving bulk time slot update:', error)
      // Revert local state on error
      setScheduleSettings(scheduleSettings)
    }
  }

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    const day = scheduleSettings.yearSchedule.find(d => d.date === date)
    if (!day || !day.isOpen) return false
    
    const slot = day.timeSlots.find(s => s.time === time)
    return slot?.available || false
  }

  // Initialize year schedule if empty
  useEffect(() => {
    if (scheduleSettings.yearSchedule.length === 0) {
      generateDefaultSchedule(new Date().getFullYear())
    }
  }, [scheduleSettings.availableDays]) // Only run when schedule settings change

  const value: AdminContextType = {
    isAuthenticated,
    currentAdmin,
    bookings,
    galleryImages,
    scheduleSettings,
    whatsappSettings,
    services,
    loading,
    login,
    loginLegacy,
    logout,
    addBooking,
    updateBookingStatus,
    updateBookingPrice,
    deleteBooking,
    confirmBookingManually,
    addGalleryImage,
    removeGalleryImage,
    resetGalleryToDefaults,
    updateScheduleSettings,
    updateWhatsAppSettings,
    cleanupExpiredBookings,
    updateTimeSlot,
    updateDayStatus,
    updateMultipleDays,
    updateTimeSlotBulk,
    generateDefaultSchedule,
    isTimeSlotAvailable,
    addService,
    updateService,
    deleteService,
    getActiveServices,
    loadData
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
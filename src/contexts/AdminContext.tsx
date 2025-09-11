import React, { createContext, useContext, useState, useEffect } from 'react'

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
  paymentMethod?: 'stripe' | 'ath' | 'admin_override'
  depositAmount?: number
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

interface AdminContextType {
  isAuthenticated: boolean
  bookings: Booking[]
  galleryImages: GalleryImage[]
  scheduleSettings: ScheduleSettings
  login: (password: string) => boolean
  logout: () => void
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'paymentDeadline'>) => string
  updateBookingStatus: (id: string, status: Booking['status'], paymentMethod?: string) => void
  confirmBookingManually: (id: string) => void
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => void
  removeGalleryImage: (id: string) => void
  updateScheduleSettings: (settings: ScheduleSettings) => void
  cleanupExpiredBookings: () => void
  // New calendar management methods
  updateTimeSlot: (date: string, time: string, available: boolean) => void
  updateDayStatus: (date: string, isOpen: boolean) => void
  updateMultipleDays: (dates: string[], isOpen: boolean) => void
  updateTimeSlotBulk: (dates: string[], timeSlots: string[], available: boolean) => void
  generateDefaultSchedule: (year: number) => void
  isTimeSlotAvailable: (date: string, time: string) => boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_PASSWORD = 'Bennett2024!'

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
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

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }

    const savedBookings = localStorage.getItem('adminBookings')
    if (savedBookings) {
      const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
        ...booking,
        date: new Date(booking.date),
        createdAt: new Date(booking.createdAt)
      }))
      setBookings(parsedBookings)
    }

    const savedGallery = localStorage.getItem('adminGallery')
    if (savedGallery) {
      const parsedGallery = JSON.parse(savedGallery).map((image: any) => ({
        ...image,
        uploadedAt: new Date(image.uploadedAt)
      }))
      setGalleryImages(parsedGallery)
    } else {
      const defaultGallery: GalleryImage[] = [
        { id: '1', src: '/images/gallery/manicures/manicure2.jpg', title: 'Diseño Elegante de Manicura', category: 'Manicura', uploadedAt: new Date() },
        { id: '2', src: '/images/gallery/manicures/manicure3.jpg', title: 'Arte Creativo en Uñas', category: 'Manicura', uploadedAt: new Date() },
        { id: '3', src: '/images/gallery/manicures/manicure4.jpg', title: 'Acabado Profesional', category: 'Manicura', uploadedAt: new Date() },
        { id: '4', src: '/images/gallery/manicures/manicure5.jpg', title: 'Combinación de Colores Elegante', category: 'Manicura', uploadedAt: new Date() },
        { id: '5', src: '/images/gallery/manicures/manicureclassic.jpg', title: 'Manicura Francesa Clásica', category: 'Manicura', uploadedAt: new Date() },
        { id: '6', src: '/images/gallery/manicures/manicureengaged.jpg', title: 'Diseño para Ocasión Especial', category: 'Manicura', uploadedAt: new Date() },
        { id: '7', src: '/images/gallery/manicures/manicurefresh.jpg', title: 'Look Fresco de Verano', category: 'Manicura', uploadedAt: new Date() },
        { id: '8', src: '/images/gallery/pedicures/pedicure-classic.JPG', title: 'Pedicura Clásica', category: 'Pedicura', uploadedAt: new Date() },
        { id: '9', src: '/images/gallery/pedicures/pedicure.JPG', title: 'Pedicura Profesional', category: 'Pedicura', uploadedAt: new Date() },
        { id: '10', src: '/images/gallery/pedicures/pedicureRed.JPG', title: 'Pedicura Roja Vibrante', category: 'Pedicura', uploadedAt: new Date() }
      ]
      setGalleryImages(defaultGallery)
    }

    const savedSchedule = localStorage.getItem('adminSchedule')
    if (savedSchedule) {
      setScheduleSettings(JSON.parse(savedSchedule))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('adminBookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem('adminGallery', JSON.stringify(galleryImages))
  }, [galleryImages])

  useEffect(() => {
    localStorage.setItem('adminSchedule', JSON.stringify(scheduleSettings))
  }, [scheduleSettings])

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
  }

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'paymentDeadline'>): string => {
    const now = new Date()
    const paymentDeadline = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now
    
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: now,
      paymentDeadline,
      depositAmount: 25
    }
    setBookings(prev => [newBooking, ...prev])
    return newBooking.id
  }

  const updateBookingStatus = (id: string, status: Booking['status'], paymentMethod?: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              status,
              paymentMethod: paymentMethod as any,
              paymentDeadline: status === 'confirmed' ? undefined : booking.paymentDeadline
            } 
          : booking
      )
    )
  }

  const confirmBookingManually = (id: string) => {
    updateBookingStatus(id, 'confirmed', 'admin_override')
  }

  const cleanupExpiredBookings = () => {
    const now = new Date()
    setBookings(prev => 
      prev.map(booking => {
        if (
          booking.status === 'pending' && 
          booking.paymentDeadline && 
          now > booking.paymentDeadline
        ) {
          return { ...booking, status: 'cancelled' as const }
        }
        return booking
      })
    )
  }

  const addGalleryImage = (imageData: Omit<GalleryImage, 'id' | 'uploadedAt'>) => {
    const newImage: GalleryImage = {
      ...imageData,
      id: Date.now().toString(),
      uploadedAt: new Date()
    }
    setGalleryImages(prev => [newImage, ...prev])
  }

  const removeGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(image => image.id !== id))
  }

  const updateScheduleSettings = (settings: ScheduleSettings) => {
    setScheduleSettings(settings)
  }

  // New calendar management methods
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

  const updateTimeSlot = (date: string, time: string, available: boolean) => {
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: prev.yearSchedule.map(day => 
        day.date === date 
          ? {
              ...day,
              timeSlots: day.timeSlots.map(slot =>
                slot.time === time ? { ...slot, available } : slot
              )
            }
          : day
      )
    }))
  }

  const updateDayStatus = (date: string, isOpen: boolean) => {
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: prev.yearSchedule.map(day => 
        day.date === date 
          ? {
              ...day,
              isOpen,
              // If closing the day, make all time slots unavailable. If opening, make them all available
              timeSlots: day.timeSlots.map(slot => ({ ...slot, available: isOpen }))
            }
          : day
      )
    }))
  }

  const updateMultipleDays = (dates: string[], isOpen: boolean) => {
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: prev.yearSchedule.map(day => 
        dates.includes(day.date)
          ? {
              ...day,
              isOpen,
              // When changing day status, set all time slots to match the day status
              timeSlots: day.timeSlots.map(slot => ({ ...slot, available: isOpen }))
            }
          : day
      )
    }))
  }

  const updateTimeSlotBulk = (dates: string[], timeSlots: string[], available: boolean) => {
    setScheduleSettings(prev => ({
      ...prev,
      yearSchedule: prev.yearSchedule.map(day => 
        dates.includes(day.date)
          ? {
              ...day,
              timeSlots: day.timeSlots.map(slot =>
                timeSlots.includes(slot.time) ? { ...slot, available } : slot
              )
            }
          : day
      )
    }))
  }

  const isTimeSlotAvailable = (date: string, time: string): boolean => {
    const day = scheduleSettings.yearSchedule.find(d => d.date === date)
    if (!day || !day.isOpen) return false
    
    const slot = day.timeSlots.find(s => s.time === time)
    return slot?.available || false
  }

  // Automatic cleanup of expired bookings
  useEffect(() => {
    const interval = setInterval(() => {
      cleanupExpiredBookings()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Initialize year schedule if empty
  useEffect(() => {
    if (scheduleSettings.yearSchedule.length === 0) {
      generateDefaultSchedule(new Date().getFullYear())
    }
  }, [])

  // Clear existing schedule data to apply new defaults (run once)
  useEffect(() => {
    const hasResetSchedule = localStorage.getItem('hasResetToOpenDefault')
    if (!hasResetSchedule) {
      // Clear existing schedule and regenerate with new defaults
      localStorage.removeItem('adminSchedule')
      generateDefaultSchedule(new Date().getFullYear())
      localStorage.setItem('hasResetToOpenDefault', 'true')
    }
  }, [])

  const value: AdminContextType = {
    isAuthenticated,
    bookings,
    galleryImages,
    scheduleSettings,
    login,
    logout,
    addBooking,
    updateBookingStatus,
    confirmBookingManually,
    addGalleryImage,
    removeGalleryImage,
    updateScheduleSettings,
    cleanupExpiredBookings,
    // New calendar management methods
    updateTimeSlot,
    updateDayStatus,
    updateMultipleDays,
    updateTimeSlotBulk,
    generateDefaultSchedule,
    isTimeSlotAvailable
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
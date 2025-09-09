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
}

export interface GalleryImage {
  id: string
  src: string
  title: string
  category: 'Manicura' | 'Pedicura' | 'Especial'
  uploadedAt: Date
}

export interface ScheduleSettings {
  availableDays: number[]
  availableHours: string[]
  blockedDates: string[]
}

interface AdminContextType {
  isAuthenticated: boolean
  bookings: Booking[]
  galleryImages: GalleryImage[]
  scheduleSettings: ScheduleSettings
  login: (password: string) => boolean
  logout: () => void
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void
  updateBookingStatus: (id: string, status: Booking['status']) => void
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => void
  removeGalleryImage: (id: string) => void
  updateScheduleSettings: (settings: ScheduleSettings) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_PASSWORD = 'Bennett2024!'

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    availableHours: [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ],
    blockedDates: []
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

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setBookings(prev => [newBooking, ...prev])
  }

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
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

  const value: AdminContextType = {
    isAuthenticated,
    bookings,
    galleryImages,
    scheduleSettings,
    login,
    logout,
    addBooking,
    updateBookingStatus,
    addGalleryImage,
    removeGalleryImage,
    updateScheduleSettings
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
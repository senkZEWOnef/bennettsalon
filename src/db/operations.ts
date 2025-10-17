import { eq, desc } from 'drizzle-orm'
import { db } from './connection'
import { bookings, galleryImages, scheduleSettings, whatsappSettings } from './schema'
import type { NewBooking, NewGalleryImage } from './schema'

// Booking operations
export const bookingOperations = {
  async getAll() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt))
  },

  async create(data: NewBooking) {
    const [newBooking] = await db.insert(bookings).values(data).returning()
    return newBooking
  },

  async updateStatus(id: number, status: string, paymentMethod?: string) {
    const updateData: any = { status }
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod
    }
    if (status === 'confirmed') {
      updateData.paymentDeadline = null
    }
    
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning()
    
    return updatedBooking
  },

  async delete(id: number) {
    await db.delete(bookings).where(eq(bookings.id, id))
  },

  async cleanup() {
    await db
      .update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.status, 'pending'))
      // Note: Add proper date comparison for paymentDeadline later
  }
}

// Gallery operations
export const galleryOperations = {
  async getAll() {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.uploadedAt))
  },

  async create(data: NewGalleryImage) {
    const [newImage] = await db.insert(galleryImages).values(data).returning()
    return newImage
  },

  async delete(id: number) {
    await db.delete(galleryImages).where(eq(galleryImages.id, id))
  },

  async resetToDefaults() {
    // Clear existing images
    await db.delete(galleryImages)
    
    // Insert default images
    const defaultImages = [
      { src: '/images/gallery/manicures/manicure2.jpg', title: 'Diseño Elegante de Manicura', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicure3.jpg', title: 'Arte Creativo en Uñas', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicure4.jpg', title: 'Acabado Profesional', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicure5.jpg', title: 'Combinación de Colores Elegante', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicureclassic.jpg', title: 'Manicura Francesa Clásica', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicureengaged.jpg', title: 'Diseño para Ocasión Especial', category: 'Manicura' },
      { src: '/images/gallery/manicures/manicurefresh.jpg', title: 'Look Fresco de Verano', category: 'Manicura' },
      { src: '/images/gallery/pedicures/pedicure-classic.JPG', title: 'Pedicura Clásica', category: 'Pedicura' },
      { src: '/images/gallery/pedicures/pedicure.JPG', title: 'Pedicura Profesional', category: 'Pedicura' },
      { src: '/images/gallery/pedicures/pedicureRed.JPG', title: 'Pedicura Roja Vibrante', category: 'Pedicura' }
    ]
    
    await db.insert(galleryImages).values(defaultImages)
    return await this.getAll()
  }
}

// Schedule operations
export const scheduleOperations = {
  async get() {
    const settings = await db.select().from(scheduleSettings).limit(1)
    return settings[0] || null
  },

  async update(data: any) {
    const existing = await this.get()
    
    if (existing) {
      const [updated] = await db
        .update(scheduleSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleSettings.id, existing.id))
        .returning()
      return updated
    } else {
      const [created] = await db
        .insert(scheduleSettings)
        .values(data)
        .returning()
      return created
    }
  }
}

// WhatsApp operations
export const whatsappOperations = {
  async get() {
    const settings = await db.select().from(whatsappSettings).limit(1)
    return settings[0] || null
  },

  async update(data: any) {
    const existing = await this.get()
    
    if (existing) {
      const [updated] = await db
        .update(whatsappSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(whatsappSettings.id, existing.id))
        .returning()
      return updated
    } else {
      const [created] = await db
        .insert(whatsappSettings)
        .values(data)
        .returning()
      return created
    }
  }
}
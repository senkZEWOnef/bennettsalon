import { eq, desc } from 'drizzle-orm'
import { db } from './connection'
import { bookings, galleryImages, scheduleSettings, whatsappSettings, services, jobApplications } from './schema'
import type { NewBooking, NewGalleryImage, NewService, NewJobApplication } from './schema'

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

// Service operations
export const serviceOperations = {
  async getAll() {
    return await db.select().from(services).orderBy(services.category, services.name)
  },

  async getActive() {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(services.category, services.name)
  },

  async create(data: NewService) {
    const [created] = await db
      .insert(services)
      .values(data)
      .returning()
    return created
  },

  async update(id: number, data: Partial<NewService>) {
    const [updated] = await db
      .update(services)
      .set(data)
      .where(eq(services.id, id))
      .returning()
    return updated
  },

  async delete(id: number) {
    return await db
      .delete(services)
      .where(eq(services.id, id))
  },

  async initializeDefaults() {
    // Check if services already exist
    const existing = await db.select().from(services).limit(1)
    if (existing.length > 0) {
      return existing
    }

    // Create default services
    const defaultServices: NewService[] = [
      { name: 'Manicura Clásica', category: 'Manicura', isActive: true },
      { name: 'Manicura en Gel', category: 'Manicura', isActive: true },
      { name: 'Manicura Rusa', category: 'Manicura', isActive: true },
      { name: 'Diseños Personalizados', category: 'Manicura', isActive: true },
      { name: 'Gel Tips', category: 'Manicura', isActive: true },
      { name: 'Hard Gel', category: 'Manicura', isActive: true },
      { name: 'Pedicura Clásica', category: 'Pedicura', isActive: true },
      { name: 'Pedicura Spa', category: 'Pedicura', isActive: true },
      { name: 'Combo Manicura & Pedicura', category: 'Combo', isActive: true },
      { name: 'Tratamiento Especial', category: 'Especial', isActive: true }
    ]

    return await db
      .insert(services)
      .values(defaultServices)
      .returning()
  }
}

// Job applications operations
export const jobApplicationOperations = {
  async getAll() {
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt))
  },

  async getByStatus(status: string) {
    return await db.select().from(jobApplications).where(eq(jobApplications.status, status)).orderBy(desc(jobApplications.createdAt))
  },

  async create(data: NewJobApplication) {
    const [created] = await db
      .insert(jobApplications)
      .values(data)
      .returning()
    return created
  },

  async updateStatus(id: number, status: string, notes?: string) {
    const updateData: Partial<NewJobApplication> = { 
      status,
      reviewedAt: new Date()
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const [updated] = await db
      .update(jobApplications)
      .set(updateData)
      .where(eq(jobApplications.id, id))
      .returning()
    return updated
  },

  async addNotes(id: number, notes: string) {
    const [updated] = await db
      .update(jobApplications)
      .set({ notes, reviewedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning()
    return updated
  },

  async delete(id: number) {
    return await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, id))
  },

  async getStats() {
    const all = await db.select().from(jobApplications)
    return {
      total: all.length,
      pending: all.filter(app => app.status === 'pending').length,
      reviewed: all.filter(app => app.status === 'reviewed').length,
      contacted: all.filter(app => app.status === 'contacted').length,
      hired: all.filter(app => app.status === 'hired').length,
      rejected: all.filter(app => app.status === 'rejected').length
    }
  }
}
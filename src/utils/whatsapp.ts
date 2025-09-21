interface WhatsAppConfig {
  adminNumber: string
  businessName: string
  businessAddress: string
}

interface BookingDetails {
  clientName: string
  clientPhone: string
  service: string
  date: Date
  time: string
  bookingId: string
}

// Utility function to format phone number for WhatsApp
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // If it starts with 1, keep it. If it's 10 digits, add 1 for US/PR
  if (cleaned.length === 10) {
    return `1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned
  } else if (cleaned.length === 11 && cleaned.startsWith('787')) {
    return `1${cleaned}`
  } else if (cleaned.length === 10 && (cleaned.startsWith('787') || cleaned.startsWith('939'))) {
    return `1${cleaned}`
  }
  
  return cleaned
}

// Format date and time for Spanish locale
const formatDateTime = (date: Date, time: string): { dateStr: string, timeStr: string } => {
  const dateStr = date.toLocaleDateString('es-PR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // Convert 24-hour time to 12-hour format
  const [hours, minutes] = time.split(':')
  const hour24 = parseInt(hours)
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
  const ampm = hour24 >= 12 ? 'PM' : 'AM'
  const timeStr = `${hour12}:${minutes} ${ampm}`
  
  return { dateStr, timeStr }
}

// Generate WhatsApp URL with pre-filled message
const createWhatsAppURL = (phoneNumber: string, message: string): string => {
  const formattedPhone = formatPhoneNumber(phoneNumber)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

// Message templates
const createClientConfirmationMessage = (booking: BookingDetails, config: WhatsAppConfig): string => {
  const { dateStr, timeStr } = formatDateTime(booking.date, booking.time)
  
  return `¡Hola ${booking.clientName}! 💅✨

Tu cita en ${config.businessName} ha sido CONFIRMADA.

📅 *Detalles de tu cita:*
• Servicio: ${booking.service}
• Fecha: ${dateStr}
• Hora: ${timeStr}
• Ubicación: ${config.businessAddress}

🎉 ¡Estamos emocionadas de verte y crear algo hermoso para ti!

Si necesitas hacer algún cambio, por favor avísanos con al menos 24 horas de anticipación.

¡Nos vemos pronto! 💖

- Equipo ${config.businessName}`
}

const createAdminNotificationMessage = (booking: BookingDetails, config: WhatsAppConfig): string => {
  const { dateStr, timeStr } = formatDateTime(booking.date, booking.time)
  
  return `🔔 *NUEVA CITA CONFIRMADA*

📋 *Detalles:*
• Cliente: ${booking.clientName}
• Teléfono: ${booking.clientPhone}
• Servicio: ${booking.service}
• Fecha: ${dateStr}
• Hora: ${timeStr}
• ID Reserva: ${booking.bookingId}

✅ El cliente ha sido notificado por WhatsApp.

*${config.businessName} - Sistema de Reservas*`
}

// Main functions to send WhatsApp messages
export const sendClientConfirmation = (booking: BookingDetails, config: WhatsAppConfig): string => {
  const message = createClientConfirmationMessage(booking, config)
  return createWhatsAppURL(booking.clientPhone, message)
}

export const sendAdminNotification = (booking: BookingDetails, config: WhatsAppConfig): string => {
  const message = createAdminNotificationMessage(booking, config)
  return createWhatsAppURL(config.adminNumber, message)
}

// Function to automatically open WhatsApp messages (can be called from confirmation logic)
export const sendWhatsAppNotifications = (booking: BookingDetails, config: WhatsAppConfig): {
  clientURL: string
  adminURL: string
} => {
  const clientURL = sendClientConfirmation(booking, config)
  const adminURL = sendAdminNotification(booking, config)
  
  return { clientURL, adminURL }
}

// Function to open WhatsApp in new window/tab
export const openWhatsApp = (url: string): void => {
  window.open(url, '_blank')
}

// Combined function to send both notifications
export const triggerWhatsAppNotifications = (booking: BookingDetails, config?: WhatsAppConfig): void => {
  // Default config if none provided
  const defaultConfig: WhatsAppConfig = {
    adminNumber: '17878682382',
    businessName: 'Bennett Salon de Beauté',
    businessAddress: 'Aguada, Puerto Rico'
  }
  
  const activeConfig = config || defaultConfig
  const { clientURL, adminURL } = sendWhatsAppNotifications(booking, activeConfig)
  
  // Open client message first
  setTimeout(() => openWhatsApp(clientURL), 500)
  
  // Open admin message after a delay
  setTimeout(() => openWhatsApp(adminURL), 2000)
}
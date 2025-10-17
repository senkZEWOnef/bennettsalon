# Bennett Salon Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Bennett Salon Database Schema                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          bookings                                                       │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔑 id: serial (PK)                                                                                     │
│ 📅 date: timestamp (NOT NULL)                                                                          │
│ 🕐 time: text (NOT NULL)                                                                               │
│ 💅 service: text (NOT NULL)                                                                            │
│ 👤 client_name: text (NOT NULL)                                                                        │
│ 📧 client_email: text (NOT NULL)                                                                       │
│ 📱 client_phone: text (NOT NULL)                                                                       │
│ 📊 status: text (NOT NULL, default: 'pending')                                                         │
│    Values: 'pending' | 'confirmed' | 'cancelled'                                                       │
│ 📅 created_at: timestamp (NOT NULL, default: now())                                                    │
│ ⏰ payment_deadline: timestamp                                                                          │
│ 💳 payment_method: text                                                                                │
│    Values: 'ath' | 'admin_override'                                                                    │
│ 💰 deposit_amount: integer (default: 25)                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        gallery_images                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔑 id: serial (PK)                                                                                     │
│ 🖼️ src: text (NOT NULL)                                                                               │
│ 📝 title: text (NOT NULL)                                                                              │
│ 🏷️ category: text (NOT NULL)                                                                          │
│    Values: 'Manicura' | 'Pedicura' | 'Especial'                                                       │
│ 📅 uploaded_at: timestamp (NOT NULL, default: now())                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       schedule_settings                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔑 id: serial (PK)                                                                                     │
│ 📅 available_days: jsonb (NOT NULL)                                                                    │
│    Format: array of numbers [1,2,3,4,5] (weekdays)                                                    │
│ 🕐 available_hours: jsonb (NOT NULL)                                                                   │
│    Format: array of time strings ["09:00", "10:00", ...]                                              │
│ 🚫 blocked_dates: jsonb (NOT NULL)                                                                     │
│    Format: array of date strings ["2024-12-25", ...]                                                  │
│ 📋 year_schedule: jsonb (NOT NULL)                                                                     │
│    Format: array of DaySchedule objects                                                               │
│ 🔄 updated_at: timestamp (NOT NULL, default: now())                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       whatsapp_settings                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔑 id: serial (PK)                                                                                     │
│ 📱 admin_number: text (NOT NULL)                                                                       │
│ 🏢 business_name: text (NOT NULL)                                                                      │
│ 📍 business_address: text (NOT NULL)                                                                   │
│ 🔔 enable_notifications: boolean (NOT NULL, default: true)                                             │
│ 🔄 updated_at: timestamp (NOT NULL, default: now())                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         admin_users                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔑 id: serial (PK)                                                                                     │
│ 👤 username: text (NOT NULL, UNIQUE)                                                                   │
│ 🔒 password_hash: text (NOT NULL)                                                                      │
│ 📅 created_at: timestamp (NOT NULL, default: now())                                                    │
│ 🕐 last_login: timestamp                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Schema Overview

### Database Technology
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Migrations**: Single migration `0000_dashing_stingray.sql`

### Table Relationships
**NO FOREIGN KEY RELATIONSHIPS** - This is a standalone table design optimized for simplicity:

- **bookings**: Independent booking records (no user accounts required)
- **gallery_images**: Standalone image management  
- **schedule_settings**: Singleton configuration table (single record)
- **whatsapp_settings**: Singleton configuration table (single record)
- **admin_users**: Independent admin authentication

### Logical Business Relationships
While there are no database-enforced foreign keys, there are logical business connections:

```
admin_users -(manages)-> bookings
admin_users -(manages)-> gallery_images  
admin_users -(configures)-> schedule_settings
admin_users -(configures)-> whatsapp_settings

schedule_settings -(controls availability for)-> bookings
whatsapp_settings -(sends notifications for)-> bookings
```

### Key Features

#### 🔧 Configuration Management
- **schedule_settings**: Flexible JSONB storage for complex scheduling rules
- **whatsapp_settings**: Business contact and notification preferences
- Both are singleton tables (single record per table)

#### 📱 Booking System
- **Guest bookings**: No user registration required
- **Payment tracking**: ATH Móvil integration with $25 default deposit
- **Status workflow**: pending → confirmed/cancelled
- **Payment deadline tracking**: Automatic cleanup of expired bookings

#### 🖼️ Content Management
- **Gallery**: Categorized image storage (Manicura/Pedicura/Especial)
- **Default images**: Pre-loaded portfolio content
- **Admin management**: Upload/delete capabilities

#### 🔒 Security Features
- **Password hashing**: bcryptjs with salt rounds (10)
- **Unique constraints**: Username uniqueness enforced
- **Session tracking**: Last login timestamps
- **Default admin accounts**: 
  - `admin` / `Bennett2024!`
  - `backdoor` / `BackdoorAccess2024!` 
  - `test` / `TestAccount123!`

### Data Types & Defaults
- **serial**: Auto-incrementing primary keys
- **jsonb**: Flexible configuration storage for complex data structures
- **timestamp**: Automatic now() defaults for audit fields
- **text**: String fields with application-level validation
- **boolean/integer**: Typed fields with sensible defaults

### Business Logic Implementation
- **Booking cleanup**: Automatic cancellation of expired pending bookings
- **Configuration upserts**: Create-or-update pattern for settings tables
- **Gallery reset**: Restore default portfolio images functionality
- **Admin authentication**: Username/password with bcrypt hashing

This schema is designed for a **small business salon** with emphasis on **simplicity**, **guest booking capability**, and **administrative control** without complex user relationship systems or customer account management.
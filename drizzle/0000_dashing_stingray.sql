CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"time" text NOT NULL,
	"service" text NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"client_phone" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"payment_deadline" timestamp,
	"payment_method" text,
	"deposit_amount" integer DEFAULT 25
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"available_days" jsonb NOT NULL,
	"available_hours" jsonb NOT NULL,
	"blocked_dates" jsonb NOT NULL,
	"year_schedule" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_number" text NOT NULL,
	"business_name" text NOT NULL,
	"business_address" text NOT NULL,
	"enable_notifications" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

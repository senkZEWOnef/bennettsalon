CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"applicant_name" text NOT NULL,
	"applicant_email" text NOT NULL,
	"applicant_phone" text NOT NULL,
	"position" text NOT NULL,
	"experience" text,
	"cover_letter" text,
	"resume_file_name" text,
	"resume_file_size" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);

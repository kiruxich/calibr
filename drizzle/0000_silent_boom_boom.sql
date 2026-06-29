CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text DEFAULT 'booking' NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"service" text,
	"service_label" text,
	"slot_id" text,
	"slot_title" text,
	"slot_date" text,
	"comment" text DEFAULT '',
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"title" text NOT NULL,
	"direction" text NOT NULL,
	"spots_total" integer DEFAULT 0 NOT NULL,
	"spots_left" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"day" text NOT NULL,
	"time" text NOT NULL,
	"event" text NOT NULL,
	"direction" text NOT NULL
);

CREATE TABLE "daily_live_visitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "created_at" timestamp DEFAULT now();
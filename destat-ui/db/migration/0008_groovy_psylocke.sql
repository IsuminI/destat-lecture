CREATE TABLE "daily_archive_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);

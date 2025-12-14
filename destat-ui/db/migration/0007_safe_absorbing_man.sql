CREATE TABLE "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"survey_id" varchar,
	"message" text NOT NULL,
	"sender" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE no action ON UPDATE no action;
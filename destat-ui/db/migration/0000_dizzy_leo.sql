CREATE TABLE "answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb,
	"survey_id" varchar
);
--> statement-breakpoint
CREATE TABLE "survey" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"target_number" bigint NOT NULL,
	"reward_amount" bigint NOT NULL,
	"questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"owner" varchar NOT NULL,
	"image" text NOT NULL,
	"finish" boolean DEFAULT false,
	"view" bigint DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "answer" ADD CONSTRAINT "answer_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE no action ON UPDATE no action;
CREATE TABLE "daily_visitor" (
	"id" serial NOT NULL,
	"count" bigint DEFAULT 0,
	"day_start" timestamp NOT NULL
);

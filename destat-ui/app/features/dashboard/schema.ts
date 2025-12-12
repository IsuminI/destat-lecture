import { pgTable, bigint, serial, timestamp } from "drizzle-orm/pg-core";

export const dailyVisitor = pgTable("daily_visitor", {
  id: serial().notNull().primaryKey(),
  count: bigint({ mode: "number" }).default(0),
  day_start: timestamp().notNull().unique(),
});
export const dailyLiveVisitor = pgTable("daily_live_survey", {
  id: serial().notNull().primaryKey(),
  count: bigint({ mode: "number" }).default(0),
  created_at: timestamp().defaultNow(),
});

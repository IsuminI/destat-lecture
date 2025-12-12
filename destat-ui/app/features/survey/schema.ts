// Schemas for survey

// for static data
// - title
// - description
// - targetNumber
// - rewardAmount
// - question & option
// - owner
// - image
// - finish

// for dynamic data
// - answers
// - view

// schema.ts
import {
  bigint,
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
export const survey = pgTable("survey", {
  id: varchar().notNull().primaryKey(),
  title: varchar().notNull(),
  description: text().notNull(),
  target_number: integer().notNull(),
  reward_amount: doublePrecision().notNull(),
  questions: jsonb().notNull().default([]),
  owner: varchar().notNull(),
  image: text().notNull(),
  finish: boolean().default(false),
  view: bigint({ mode: "number" }).default(0),
});

export const answer = pgTable("answer", {
  id: serial().primaryKey(),
  answers: jsonb().default({}),
  survey_id: varchar().references(() => survey.id),
});

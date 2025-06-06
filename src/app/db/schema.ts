import { pgTable, serial, text, integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  role: varchar("role", { length: 50 }).notNull(), // "user" | "choreographer" | "admin" 
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  choreographerId: varchar("choreographer_id", { length: 191 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dancers = pgTable("dancers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

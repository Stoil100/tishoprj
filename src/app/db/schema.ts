import {
    date,
    integer,
    pgTable,
    serial,
    text,
    time,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: varchar("id", { length: 191 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull(), // "user" | "choreographer" | "admin"
    username: text("username").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    choreographer_id: varchar("choreographer_id", { length: 191 })
        .notNull()
        .references(() => users.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export const dancers = pgTable("dancers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    group_id: integer("group_id")
        .notNull()
        .references(() => groups.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export const rehearsals = pgTable("rehearsals", {
    id: serial("id").primaryKey(),
    group_id: integer("group_id")
        .notNull()
        .references(() => groups.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    start_time: time("start_time").notNull(),
    end_time: time("end_time").notNull(),
    choreographer_id: varchar("choreographer_id", { length: 191 })
        .notNull()
        .references(() => users.id),
});

export const rehearsal_attendance = pgTable("rehearsal_attendance", {
    id: serial("id").primaryKey(),
    rehearsal_id: integer("rehearsal_id")
        .notNull()
        .references(() => rehearsals.id, { onDelete: "cascade" }),
    dancer_id: integer("dancer_id")
        .notNull()
        .references(() => dancers.id, { onDelete: "cascade" }),
    payment_type: varchar("payment_type", { length: 50 }).default(""),
});

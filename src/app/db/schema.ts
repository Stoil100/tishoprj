import {
    date,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    time,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const paymentTypeEnum = pgEnum("payment_type", [
    "cash",
    "card",
    "multisport",
    "coolfit",
    "monthly",
    "presence",
]);
export const roleEnum = pgEnum("user_role", ["user", "choreographer", "admin"]);

export const users = pgTable(
    "users",
    {
        id: varchar("id", { length: 191 }).primaryKey(),
        email: varchar("email", { length: 255 }).notNull(),
        role: roleEnum("role").notNull(),
        username: text("username").notNull(),
        created_at: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => ({
        emailUniq: uniqueIndex("users_email_unique").on(t.email),
    }),
);

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
    monthly_paid_at: timestamp("monthly_paid_at"),
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

export const rehearsal_attendance = pgTable(
    "rehearsal_attendance",
    {
        id: serial("id").primaryKey(),
        rehearsal_id: integer("rehearsal_id")
            .notNull()
            .references(() => rehearsals.id, { onDelete: "cascade" }),
        dancer_id: integer("dancer_id")
            .notNull()
            .references(() => dancers.id, { onDelete: "cascade" }),
        payment_type: paymentTypeEnum("payment_type"),
    },
    (t) => ({
        uniq: uniqueIndex("uniq_attendance_rehearsal_dancer").on(
            t.rehearsal_id,
            t.dancer_id,
        ),
    }),
);

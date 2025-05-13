import { pgTable, integer, varchar, text, boolean, numeric, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
});

export const groupTable = pgTable("groups", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const groupUsersTable = pgTable("group_users", {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").notNull().references(() => groupTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }),
});

export const receiptsTable = pgTable("receipts", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    groupId: uuid("group_id").notNull().references(() => groupTable.id, { onDelete: "cascade" }),
    gst: numeric("gst").notNull(),
    serviceCharge: numeric("service_charge").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const receiptItemsTable = pgTable("receipt_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    receiptId: uuid("receipt_id").notNull().references(() => receiptsTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    unitCost: numeric("unit_cost").notNull(),
});

export const receiptItemSharesTable = pgTable("receipt_item_shares", {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull().references(() => receiptItemsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }),
    share: numeric("share").notNull().default("0")
});
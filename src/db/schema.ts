import { pgTable, integer, varchar, text, boolean, numeric, primaryKey, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
});

export const groupTable = pgTable("groups", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const groupUsersTable = pgTable("group_users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    groupId: integer("group_id").notNull().references(() => groupTable.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }),
});

export const receiptsTable = pgTable("receipts", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    groupId: integer("group_id").notNull().references(() => groupTable.id, { onDelete: "cascade" }),
    gst: numeric("gst").notNull(),
    serviceCharge: numeric("service_charge").notNull(),
    createdAt: timestamp("created_at").notNull(),
});

export const receiptUsersTable = pgTable("receipt_users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    receiptId: integer().notNull().references(() => receiptsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }),
});

export const receiptItemsTable = pgTable("receipt_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    receiptId: integer().notNull().references(() => receiptsTable.id, { onDelete: "cascade" }),
    quantity: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    unitCost: integer().notNull(),
});

export const receiptItemSharesTable = pgTable("receipt_item_shares", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    itemId: integer().notNull().references(() => receiptItemsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }),
    share: numeric("share").notNull().default("0")
});
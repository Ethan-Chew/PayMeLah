// import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

// export const usersTable = pgTable("users", {
//     id: integer().primaryKey().generatedAlwaysAsIdentity(),
//     name: varchar({ length: 255 }).notNull(),
//     email: varchar({ length: 255}).notNull()
// });

type User = {
    id: string,
    name: string,
}

type Receipt = {
    items: ReceiptItem[],
    gst: number,
    serviceCharge: number
}

type ReceiptItem = {
    quantity: number,
    name: string,
    unitCost: number
}

type Group = {
    name: string,
    users: User[],
    receipts: Receipt[]
}

export type { User, Receipt, ReceiptItem, Group }
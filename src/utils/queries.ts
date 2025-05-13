import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";

export async function saveReceipt(receiptFormData: CreateReceiptModal, receiptData: ParsedReceipt, receiptItems: any[]) {
    let receiptId: string = "";
    await db.transaction(async (tx) => {
        // Create the Group
        const groupId = await tx.insert(groupTable).values({}).returning({ id: groupTable.id})
        // Add People to the Group
        const userNames = [...receiptFormData.others, receiptFormData.payee].filter((name) => name !== "");
        await db.insert(groupUsersTable).values(userNames.map((name) => (
            {
                groupId: groupId[0].id,
                userName: name
            }
        )));
        // Save the Receipt Data
        const receiptResult = await tx.insert(receiptsTable).values({
            name: receiptFormData.title,
            groupId: groupId[0].id,
            gst: receiptData.gst.toString(),
            serviceCharge: receiptData.serviceCharge.toString(),
        }).returning({ id: receiptsTable.id });
        receiptId = receiptResult[0].id;

        // Add the Receipt Items
        const receiptItems = await tx.insert(receiptItemsTable).values(
            receiptData.items.map((item) => (
               {
                    receiptId: receiptId,
                    quantity: item.quantity,
                    name: item.name,
                    unitCost: item.unitCost.toString(),
               }
            ))
        ).returning({ id: receiptItemsTable.id, name: receiptItemsTable.name });
        // Add the Receipt Item Shares
        /// Get all the users in the group for sharing
        const groupUsers = await tx.select({ 
            userName: groupUsersTable.userName 
        }).from(groupUsersTable)
        .where(
            eq(groupUsersTable.groupId, groupId[0].id)
        );
        // Create share entries for each item and each user
        await tx.insert(receiptItemSharesTable).values(
            receiptItems.flatMap((item) => {
                // For each receipt item, create a share for each user
                return groupUsers.map((user) => ({
                    itemId: item.id,
                    userName: user.userName,
                    // Default to equal shares - you may want to replace this with actual share calculation logic
                    share: (1 / groupUsers.length).toString()
                }));
            })
        );
    });

    return receiptId;
}
import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import { db } from "@/utils/db";

export async function saveReceipt(receiptFormData: CreateReceiptModal, receiptData: ParsedReceipt, receiptItems: any[]) {
    let receiptId: string = "";
    await db.transaction(async (tx) => {
        // Create the Group
        const groupId = await db.insert(groupTable).values({}).returning({ id: groupTable.id})
        // Add People to the Group
        const userNames = [...receiptFormData.others, receiptFormData.payee].filter((name) => name !== "");
        await db.insert(groupUsersTable).values(userNames.map((name) => (
            {
                groupId: groupId[0].id,
                userName: name
            }
        )));
        // Save the Receipt Data
        const rID = await db.insert(receiptsTable).values({
            name: receiptFormData.title,
            groupId: groupId[0].id,
            gst: receiptData.gst,
            serviceCharge: receiptData.serviceCharge,
        }).returning({ id: receiptsTable.id });
        // Add the Receipt Items
        const receiptItems = await db.insert(receiptItemsTable).values(
            receiptData.items.map((item) => (
               {
                    receiptId: rID[0].id,
                    quantity: item.quantity,
                    name: item.name,
                    unitCost: item.unitCost.toString(),
               }
            ))
        ).returning({ id: receiptItemsTable.id, name: receiptItemsTable.name });
        // Add the Receipt Item Shares
        // await db.insert(receiptItemSharesTable).values(
        //     receiptItems.map((item) => (

        //     ))
        // )
    });
}
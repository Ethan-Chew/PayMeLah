import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { CreateReceiptModal } from "@/db/types";
import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { receiptFormData, receiptItems, gst, serviceCharge }: { receiptFormData: CreateReceiptModal, receiptItems: any, gst: number, serviceCharge: number } = body;
    // Validate required data
    // if (!receiptFormData  || !receiptItems|| !gst || !serviceCharge) {
    //   return NextResponse.json(
    //     { error: 'Missing required receipt data' }, 
    //     { status: 400 }
    //   );
    // }

    // Save the receipt using the transaction logic
    let receiptId: string = "";
    await db.transaction(async (tx) => {
        // Create the Group
        const groupId = await tx.insert(groupTable).values({}).returning({ id: groupTable.id });
        
        // Add People to the Group
        const userNames = [...receiptFormData.others, receiptFormData.payee].filter((name) => name !== "");
        const insertedUsers = await tx.insert(groupUsersTable).values(userNames.map((name) => (
            {
                groupId: groupId[0].id,
                userName: name
            }
        ))).returning({ id: groupUsersTable.id, userName: groupUsersTable.userName });
        
        // Save the Receipt Data
        const receiptResult = await tx.insert(receiptsTable).values({
            name: receiptFormData.title,
            groupId: groupId[0].id,
            gst: gst.toString(),
            serviceCharge: serviceCharge.toString(),
        }).returning({ id: receiptsTable.id });
        receiptId = receiptResult[0].id;

        // Add the Receipt Items
        const savedReceiptItems = await tx.insert(receiptItemsTable).values(
            receiptItems.map((item: any) => (
            {
                receiptId: receiptId,
                quantity: item.quantity,
                name: item.name,
                unitCost: item.unitCost.toString(),
            }
            ))
        ).returning({ id: receiptItemsTable.id, name: receiptItemsTable.name });
      
        // Create share entries for each item and each user
        for (const item of savedReceiptItems) {
            const itemWithShare = receiptItems.find((itemWithShare: any) => item.name === itemWithShare.name);
            for (const share of itemWithShare.shares) {
                const user = insertedUsers.find((user) => user.userName === share.userName);
                if (user) {
                    await tx.insert(receiptItemSharesTable).values({
                        itemId: item.id,
                        userName: user.userName,
                        share: share.share.toString()
                    });
                }
            }
        }
    });

    // Return the receipt ID on success
    return NextResponse.json({ 
      success: true, 
      message: 'Receipt saved successfully', 
      receiptId 
    }, { status: 201 });
    
  } catch (err) {
    console.error('Error saving receipt:', err);
    return NextResponse.json({ error: 'Failed to save receipt' }, { status: 500 });
  }
}
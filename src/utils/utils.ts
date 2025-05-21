"use server";
import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import { db } from "@/utils/db";
import OpenAI from 'openai';

import dotenv from 'dotenv';
import { eq } from "drizzle-orm";
dotenv.config();

export async function parseReceiptData(fileUrl: string) {
    if (!fileUrl) {
        return null;
    }

    // Use the OpenAI API to Analyse the Receipt
    // const apiResponse = await client.chat.completions.create({
    //     model: "gpt-4.1-nano"
    // });
    // MOCK: API Response
    const apiResponse = `
    Veg Sandwich|1|5.75  
    Latte|2|4.25  
    Blueberry Muffin|0|0  
    Green Tea|1|3.15  
    Pasta Alfredo|1|12.99  
    Sparkling Water|1|2.5  
    Fruit Bowl|2|0  
    gst|0  
    serviceCharge|0.99
    `

    const parsedReceipt: ParsedReceipt = { items: [], gst: -1, serviceCharge: -1 };
    for (const line of apiResponse.trim().split(/\r?\n/)) {
        const splittedLine = line.split("|");

        if (splittedLine.length === 3) { // Receipt Item
            if (parseInt(splittedLine[1]) !== 0) {
                parsedReceipt.items.push({
                    name: splittedLine[0].trim(),
                    quantity: parseInt(splittedLine[1]),
                    unitCost: parseFloat(splittedLine[2]) / parseInt(splittedLine[1])
                });   
            }
        } else if (splittedLine[0].trim().toLowerCase() === "gst") {
            parsedReceipt.gst = parseFloat(splittedLine[1]) || 0
        } else if (splittedLine[0].trim().toLowerCase() === "servicecharge") {
            parsedReceipt.serviceCharge = parseFloat(splittedLine[1]) || 0
        }
    }

    return parsedReceipt;
}

export async function saveReceiptToDB(receiptFormData: CreateReceiptModal, receiptItems: any, gst: number, serviceCharge: number) {
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

    return receiptId;
}

export interface DisplayedReceipt {
    name: string;
    gst: string;
    serviceCharge: string;
    receiptItems: any[],
    members: string[]
}

export async function getReceiptData(receiptId: string) {
    const data = await db.select()
        .from(receiptsTable)
        .where(eq(receiptsTable.id, receiptId))
        .innerJoin(receiptItemsTable, eq(receiptsTable.id, receiptItemsTable.receiptId))
        .innerJoin(receiptItemSharesTable, eq(receiptItemsTable.id, receiptItemSharesTable.itemId))
        .innerJoin(groupUsersTable, eq(receiptsTable.groupId, groupUsersTable.groupId));

    if (data.length === 0) {
        return null;
    }

    const parsedReceipt: DisplayedReceipt = {
        name: data[0].receipts.name,
        gst: data[0].receipts.gst,
        serviceCharge: data[0].receipts.serviceCharge,
        receiptItems: [],
        members: [],
    }

    const addedItems = new Set();
    const addedUsers = new Set();
    const addedShares = new Set();

    for (const entry of data) {
        const item = entry.receipt_items;
        const share = entry.receipt_item_shares;
        const user = entry.group_users;

        // Add the Item to the receipt items
        if (!addedItems.has(item.id)) {
            parsedReceipt.receiptItems.push({
                name: item.name,
                quantity: item.quantity,
                unitCost: item.unitCost,
                shares: []
            });
            addedItems.add(item.id);
        }

        // Add the Share to the receipt items
        const shareId = `${item.id}-${share.userName}`;
        if (!addedShares.has(shareId)) {
            const parsedReceiptItemIndex = parsedReceipt.receiptItems.findIndex((receiptItem) => receiptItem.name === item.name);
            parsedReceipt.receiptItems[parsedReceiptItemIndex].shares.push({
                userName: share.userName,
                share: share.share
            });
            addedShares.add(shareId);
        }

        // Add the User to the members
        if (!addedUsers.has(user.userName)) {
            parsedReceipt.members.push(user.userName as string);
            addedUsers.add(user.userName);
        }
    }

    return parsedReceipt;
}
"use server";
import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { CreateReceiptModal, ParsedReceipt, ReceiptItem } from "@/db/types";
import { db } from "@/utils/db";
import OpenAI from 'openai';

import dotenv from 'dotenv';
import { eq } from "drizzle-orm";
dotenv.config();

export async function parseReceiptData(fileUrl: string) {
    if (!fileUrl) {
        return null;
    }

    const systemMessage = `Extract items as: ItemName|Quantity|Price per line. End with: gst|amount, serviceCharge|amount. Use exact item names, remove item codes, ignore modifiers. Missing qty=1, free=0, no GST=gst|0, no service=serviceCharge|0. No extra text.
Example:
Veg Sandwich|1|5.75
Latte|2|4.25
Blueberry Muffin|0|0
gst|0
serviceCharge|0.99`

    const isDev = process.env.DEPLOYMENT_TYPE === "development";

    // Use the OpenAI API to Analyse the Receipt
    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY,
    })

    let textualResponse: string = "";
    if (isDev) {
        // MOCK: API Response for Development
        textualResponse = `
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
    } else {
        const apiResponse = await client.responses.create({
            model: "gpt-4.1-nano",
            input: [
                {
                    role: "user",
                    content: [
                        { type: "input_text", text: systemMessage },
                        {
                            type: "input_image",
                            image_url: `${fileUrl}`,
                            detail: "auto"
                        }
                    ]
                }
            ]
        });
        textualResponse = apiResponse.output_text
    }

    const parsedReceipt: ParsedReceipt = { items: [], gst: -1, serviceCharge: -1 };
    for (const line of textualResponse.trim().split(/\r?\n/)) {
        const splittedLine = line.split("|");

        if (splittedLine.length === 3) { // Receipt Item
            if (parseInt(splittedLine[1]) !== 0) {
                parsedReceipt.items.push({
                    name: splittedLine[0].trim(),
                    quantity: parseInt(splittedLine[1]),
                    unitCost: parseFloat(splittedLine[2]) / parseInt(splittedLine[1]),
                    shares: []
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

export async function saveReceiptToDB(receiptFormData: CreateReceiptModal, receiptData: ParsedReceipt) {
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
            gst: receiptData.gst.toString(),
            serviceCharge: receiptData.serviceCharge.toString(),
        }).returning({ id: receiptsTable.id });
        receiptId = receiptResult[0].id;

        // Add the Receipt Items
        const savedReceiptItems = await tx.insert(receiptItemsTable).values(
            receiptData.items.map((item: ReceiptItem) => (
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
            const itemWithShare = receiptData.items.find((itemWithShare: any) => item.name === itemWithShare.name);

            if (itemWithShare) {
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
        }
    });

    return receiptId;
}

export interface DisplayedReceipt {
    name: string;
    gst: string;
    serviceCharge: string;
    receiptItems: any[],
    members: string[],
    date: string
}

function formatDate(date: Date) {
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
    const year = date.getUTCFullYear();

    // Function to add ordinal suffix
    function getOrdinal(n: number) {
        if (n > 3 && n < 21) return n + "th";
        switch (n % 10) {
            case 1: return n + "st";
            case 2: return n + "nd";
            case 3: return n + "rd";
            default: return n + "th";
        }
    }

    return `${getOrdinal(day)} ${month} ${year}`;
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
        date: formatDate(data[0].receipts.createdAt),
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

export async function determineGSTServiceChargeSplit(receipt: DisplayedReceipt) {
    type MemberSplit = {
        total: number;
        serviceCharge: number;
        gst: number;
    };
    const memberSplit: Record<string, MemberSplit> = {};
    for (const member of receipt.members) {
        const memberSpend = receipt.receiptItems.reduce((acc, item) => {
            const itemShare = item.shares.find((share: any) => share.userName === member);
            if (itemShare) {;
                return acc + (parseFloat(item.unitCost) * parseFloat(itemShare.share));
            }
            return acc;
        }, 0);

        const serviceCharge = parseFloat(receipt.serviceCharge) === 0 ? 0 : (memberSpend * 0.1);
        const gst = parseFloat(receipt.gst) === 0 ? 0 : ((memberSpend + serviceCharge) * 0.09);

        memberSplit[member] = {
            total: memberSpend + serviceCharge + gst,
            serviceCharge: serviceCharge,
            gst: gst
        };
    }

    return memberSplit;
}
"use server";
import { groupTable, groupUsersTable, receiptItemSharesTable, receiptItemsTable, receiptsTable } from "@/db/schema";
import { ReceiptDetails, ParsedReceipt, ReceiptItem, DisplayedReceipt } from "@/db/types";
import { db } from "@/utils/db";
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import dotenv from 'dotenv';
import { eq } from "drizzle-orm";
dotenv.config();

export async function parseReceiptData(fileUrl: string) {
    // Input validation
    if (!fileUrl || typeof fileUrl !== 'string') {
        throw new Error('Invalid file URL provided');
    }

    // Validate environment variables
    if (!process.env.OPENAI_KEY) {
        throw new Error('OpenAI API key is not configured');
    }

    const receiptItem = z.object({
        name: z.string().min(1, "Item name cannot be empty"),
        quantity: z.number().min(0, "Quantity must be non-negative"),
        unitPrice: z.number().min(0, "Unit price must be non-negative"),
    });

    const receipt = z.object({
        items: z.array(receiptItem),
        gst: z.number().min(0, "GST must be non-negative"),
        serviceCharge: z.number().min(0, "Service charge must be non-negative"),
    });

    const systemMessage = `You are given the text of a receipt. Extract the structured information into the schema.
    Rules:
    - Keep exact item names but strip codes/SKUs and modifiers (sizes, options).
    - Merge duplicate items into one entry and sum the quantity.
    - If quantity is missing → set to 1.
    - If item is FREE or has price 0 → qty is still counted, but unitPrice = 0.
    - If GST is missing → gst = 0.
    - If service charge is missing → serviceCharge = 0.`;

    const isDev = process.env.DEPLOYMENT_TYPE === "development";

    let openAIResponse: any;
    if (isDev) {
        // Sample API Response for Development
        openAIResponse = {
            "items": [
                { "name": "Veg Sandwich", "quantity": 1, "unitPrice": 5.75 },
                { "name": "Latte", "quantity": 2, "unitPrice": 4.25 },
                { "name": "Blueberry Muffin", "quantity": 0, "unitPrice": 0 },
                { "name": "Green Tea", "quantity": 1, "unitPrice": 3.15 },
                { "name": "Pasta Alfredo", "quantity": 1, "unitPrice": 12.99 },
                { "name": "Sparkling Water", "quantity": 1, "unitPrice": 2.5 },
                { "name": "Fruit Bowl", "quantity": 2, "unitPrice": 0 }
            ],
            "gst": 0,
            "serviceCharge": 0.99
        };
    } else {
        try {
            const client = new OpenAI({
                apiKey: process.env.OPENAI_KEY,
            });

            const apiResponse = await client.responses.parse({
                model: "gpt-5-nano",
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
                ],
                text: {
                    format: zodTextFormat(receipt, "receipt_format"),
                }
            });
            openAIResponse = apiResponse.output_parsed;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to parse receipt using OpenAI API');
        }
    }

    // Validate the OpenAI response
    try {
        const validatedResponse = receipt.parse(openAIResponse);
        
        const parsedReceipt: ParsedReceipt = {
            items: validatedResponse.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unitCost: item.unitPrice,
                shares: []
            })),
            gst: validatedResponse.gst,
            serviceCharge: validatedResponse.serviceCharge
        };

        return parsedReceipt;
    } catch (error) {
        console.error('Response validation error:', error);
        throw new Error('Invalid response format from OpenAI API');
    }
}

export async function saveReceiptToDB(receiptDetails: ReceiptDetails, receiptData: ParsedReceipt) {
    let receiptId: string = "";
    await db.transaction(async (tx) => {
        // Create the Group
        const groupId = await tx.insert(groupTable).values({}).returning({ id: groupTable.id });
        
        // Add People to the Group
        const insertedUsers = await tx.insert(groupUsersTable).values(receiptDetails.members.map((name) => (
            {
                groupId: groupId[0].id,
                userName: name
            }
        ))).returning({ id: groupUsersTable.id, userName: groupUsersTable.userName });
        
        // Save the Receipt Data
        const receiptResult = await tx.insert(receiptsTable).values({
            name: receiptDetails.title,
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
    // Fetch the receipt data from the database
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
        title: data[0].receipts.name,
        date: formatDate(data[0].receipts.createdAt),
        gst: parseFloat(data[0].receipts.gst),
        serviceCharge: parseFloat(data[0].receipts.serviceCharge),
        members: [],
        items: []
    }

    const addedItems = new Set();
    const addedUsers = new Set();
    const addedShares = new Set();

    // For every entry in the data, add the item, share and user to the parsedReceipt
    for (const entry of data) {
        const item = entry.receipt_items;
        const share = entry.receipt_item_shares;
        const user = entry.group_users;

        // Add the Item to the receipt items
        if (!addedItems.has(item.id)) {
            parsedReceipt.items.push({
                name: item.name,
                quantity: item.quantity,
                unitCost: Number(item.unitCost),
                shares: []
            });
            addedItems.add(item.id);
        }

        // Add the Share to the receipt items
        const shareId = `${item.id}-${share.userName}`;
        if (!addedShares.has(shareId) && share.userName) {
            const parsedReceiptItemIndex = parsedReceipt.items.findIndex((receiptItem) => receiptItem.name === item.name);
            parsedReceipt.items[parsedReceiptItemIndex].shares.push({
                userName: share.userName,
                share: parseFloat(share.share)
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
        const memberSpend = receipt.items.reduce((acc, item) => {
            const itemShare = item.shares.find((share: any) => share.userName === member);
            if (itemShare) {;
                return acc + (item.unitCost * itemShare.share);
            }
            return acc;
        }, 0);

        const serviceCharge = receipt.serviceCharge === 0 ? 0 : (memberSpend * 0.1);
        const gst = receipt.gst === 0 ? 0 : ((memberSpend + serviceCharge) * 0.09);

        memberSplit[member] = {
            total: memberSpend + serviceCharge + gst,
            serviceCharge: serviceCharge,
            gst: gst
        };
    }

    return memberSplit;
}
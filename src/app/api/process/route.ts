import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { ParsedReceipt } from "../schema";
import dotenv from 'dotenv';
dotenv.config();

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// })

const systemPrompt = `
Extract the attached receipt details in the following text format:
item|quantity|unitCost
item|quantity|unitCost
...
gst|<value>
serviceCharge|<value>

Rules: Use | to separate fields. Each entry on a new line. Numbers only (no currency symbols). If a value is missing, use 0. No extra text outside the output.
Check if GST is included in the meal. If so, return GST=0.

Example Output:
Coffee|2|3.5
Muffin|1|2.5
gst|0.5
serviceCharge|1.0
`

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const fileUrl = body.image;

        // Ensure that File Exists
        if (!fileUrl) {
            return NextResponse.json({
                error: "No File Uploaded"
            }, { status: 400 });
        }

        // Ensure that File is an Image
        if (!/^data:image\/(png|jpeg|jpg|gif|webp|bmp);base64,/.test(fileUrl)) {
            return NextResponse.json({
                error: "File Type Mismatch"
            }, { status: 400 });
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
        for (const line in apiResponse.trim().split(/\r?\n/)) {
            const splittedLine = line.split("|");

            if (splittedLine.length === 3) { // Receipt Item
                parsedReceipt.items.push({
                    name: splittedLine[0],
                    quantity: parseInt(splittedLine[1]),
                    unitCost: parseFloat(splittedLine[2]) / parseInt(splittedLine[1])
                });
            } else if (splittedLine[0].toLowerCase() === "gst") {
                parsedReceipt.gst = parseFloat(splittedLine[1]) || 0
            } else if (splittedLine[0].toLowerCase() === "servicecharge") {
                parsedReceipt.serviceCharge = parseFloat(splittedLine[1]) || 0
            }
        }

        return NextResponse.json({
            "status": "success",
            "receipt": parsedReceipt
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
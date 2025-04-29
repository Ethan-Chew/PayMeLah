import { NextResponse } from "next/server";
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt = `
Extract the attached receipt details in the following text format:
item|quantity|unitCost
item|quantity|unitCost
...
gst|<value>
serviceCharge|<value>

Rules: Use | to separate fields. Each entry on a new line. Numbers only (no currency symbols). If a value is missing, use 0. No extra text outside the output.

Example Output:
Coffee|2|3.5
Muffin|1|2.5
gst|0.5
serviceCharge|1.0
`

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Ensure that File Exists
    if (!file) {
        return NextResponse.json({
            error: "No File Uploaded"
        }, { status: 400 });
    }

    // Ensure that File is an Image
    const imageTypeRegex = /^image\//i
    if (!imageTypeRegex.test(file.type)) {
        return NextResponse.json({
            error: "File Type Mismatch"
        }, { status: 400 });
    }

    // Use the OpenAI API to Analyse the Receipt
    // const apiResponse = await client.chat.completions.create({
    //     model: "gpt-4.1-nano"
    // });
}
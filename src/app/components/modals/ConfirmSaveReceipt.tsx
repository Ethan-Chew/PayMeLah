"use client";

import { CreateReceiptModal, ParsedReceipt } from "@/db/types";

interface IConfirmSaveReceiptProps {
    receiptFormData: CreateReceiptModal,
    receiptItems: any[],
    receiptData: ParsedReceipt | null,
}

export default function ConfirmSaveReceipt({receiptFormData, receiptItems, receiptData}: IConfirmSaveReceiptProps) {


    return (
        <div className="z-50 fixed inset-0 top-0 left-0 w-screen h-screen bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-dark-background p-4 rounded-lg shadow-lg">

            </div>
        </div>
    )
}
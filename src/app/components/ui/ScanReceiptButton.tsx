"use client"
import { MdDocumentScanner } from "react-icons/md";

export default function ScanReceiptButton() {
    return (
        <button className="w-full flex flex-row gap-5 items-center justify-center p-2 bg-accent hover:bg-dark-accent rounded-lg cursor-pointer mb-2 duration-150">
            <MdDocumentScanner className="text-xl" />
            <p className="text-lg">Scan Receipt</p>
        </button>
    )
}
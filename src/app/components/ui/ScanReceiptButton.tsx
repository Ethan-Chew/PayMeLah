"use client"
import { MdDocumentScanner } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function ScanReceiptButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/scan")} 
            className="w-full flex flex-row gap-5 items-center justify-center p-2 bg-accent hover:bg-dark-accent rounded-lg cursor-pointer mb-2 duration-150"
        >
            <MdDocumentScanner className="text-xl" />
            <p className="text-lg">Scan Receipt</p>
        </button>
    )
}
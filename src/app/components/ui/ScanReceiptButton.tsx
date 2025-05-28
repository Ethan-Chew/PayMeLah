"use client"
import { MdDocumentScanner } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function ScanReceiptButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/scan")} 
            className="w-fit inline-flex flex-grow gap-2 items-center justify-center px-6 p-2 bg-accent hover:bg-dark-accent rounded-lg cursor-pointer mb-2 duration-150 shadow-lg drop-shadow-[0_0px_5px_rgba(18,145,143,0.25)]"
        >
            <MdDocumentScanner className="text-lg md:text-xl" />
            <p className="text-md md:text-lg">Scan Receipt</p>
        </button>
    )
}
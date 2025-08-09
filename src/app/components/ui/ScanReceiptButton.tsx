"use client"
import { useRouter } from "next/navigation";

export default function ScanReceiptButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/scan")} 
            className="bg-white text-dark-background font-bold px-6 py-2 rounded-lg cursor-pointer"
        >
            Get Started
        </button>
    )
}
"use client"
import { useRouter } from "next/navigation";

export default function ScanReceiptButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/scan")} 
            className="bg-white text-dark-background font-bold px-6 py-2 rounded-lg cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-shadow"
        >
            Get Started
        </button>
    )
}
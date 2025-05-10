"use client"
import { useEffect, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import ReceiptDetailModal from "../components/ui/modals/ReceiptDetailModal";

export default function SplitCosts() {
    const router = useRouter();
    const { imageUrl } = useAppData();

    const [ receiptData, setReceiptData ] = useState<ParsedReceipt | null>(null);
    const [ receiptFormData, setReceiptFormData ] = useState<CreateReceiptModal>({
        title: "",
        date: new Date().toLocaleDateString('en-SG'),
        payee: "",
        others: [],
        saveGroup: false
    });
    
    useEffect(() => {
        const processReceipt = async () => {
            // if (!imageUrl) router.push("/");

            const response = await fetch("/api/process", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageUrl 
                })
            });

            setReceiptData(await response.json())
        }

        processReceipt();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen flex flex-col p-10 gap-5">
            <div>
                <h1 className="text-3xl font-bold text-white">PayMeLah!</h1>
                <p className="text-dark-secondary">Assign items to each friend and share the list with them.</p>
            </div>

            <div className="p-5 rounded-lg bg-dark-container text-white">
                <h2 className="text-2xl font-semibold">Receipt Details</h2>
                <p className="text-dark-secondary mb-3">Enter some key details about your receipt to make it easily identifiable</p>

                <ReceiptDetailModal
                    formData={receiptFormData}
                    setFormData={setReceiptFormData}
                />
            </div>

            <div className="p-5 rounded-lg bg-dark-container text-white flex flex-row">
                {/* Scanned Receipt Display */}
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white">Your Scanned Receipt</h2>
                    <img src={imageUrl!} />
                </div>
                {/* Split Receipt */}
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white">Split with Friends</h2>
                </div>
            </div>
        </div>
    )
}
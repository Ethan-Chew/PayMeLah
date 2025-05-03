"use client"
import { useEffect, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import ReceiptDetailModal from "../components/ui/modals/ReceiptDetailModal";

export default function SplitCosts() {
    const router = useRouter();
    const { imageUrl } = useAppData();

    const [ isSetup, setIsSetup ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    
    useEffect(() => {
        const processReceipt = async () => {
            if (!imageUrl) router.push("/");

            const response = await fetch("/api/process", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageUrl 
                })
            });

            const json = await response.json();
        }

        processReceipt();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen flex flex-col items-center justify-center">
            <p className="text-white text-lg lg:text-xl">Processing...</p>

            <AnimatePresence>
                <ReceiptDetailModal
                    isSetup={isSetup}
                    setIsSetup={setIsSetup}
                    isLoading={isLoading}
                />
            </AnimatePresence>
        </div>
    )
}
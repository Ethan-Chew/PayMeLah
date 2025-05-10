"use client"
import { useEffect, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import ReceiptDetailModal from "../components/ui/modals/ReceiptDetailModal";
import SideBar from "../components/SideBar";
import { PayMeLahSteps } from "../components/ui/ProgressBar/data";

// React Icons
import { FaMoneyBillWave, FaCamera } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import Toast from "../components/ui/Toast";

export default function SplitCosts() {
    const router = useRouter();
    const { imageUrl } = useAppData();

    const [ error, setError ] = useState({
        isDisplayed: false,
        title: "",
        description: ""
    });

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

            if (response.ok) {
                const data = await response.json();
                setReceiptData(data);
                return;
            }

            // Handle Errors
            setError({
                isDisplayed: true,
                title: "Error Processing Receipt",
                description: (await response.json()).error
            });
        }

        processReceipt();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen w-screen flex flex-row">
            <SideBar currentStep={PayMeLahSteps.Split} />
            <div className="ml-0 sm:ml-[25%] lg:ml-[20%] flex-1 flex flex-col p-5 py-10 gap-5 max-w-full">
                <div>
                    <h1 className="text-3xl font-bold text-white">Split with your Friends</h1>
                    <p className="text-dark-secondary">Assign items to each friend and share the list with them.</p>
                </div>

                <div className="p-5 rounded-lg bg-dark-container text-white">
                    <div className="text-2xl inline-flex flex-row items-center gap-3">
                        <FaMoneyBillWave />
                        <h2 className="font-semibold">Receipt Details</h2>
                    </div>
                    <p className="text-dark-secondary mb-3">Enter some key details about your receipt to make it easily identifiable</p>

                    <ReceiptDetailModal
                        formData={receiptFormData}
                        setFormData={setReceiptFormData}
                    />
                </div>

                <div className="p-5 rounded-lg bg-dark-container text-white flex flex-row gap-5">
                    {/* Scanned Receipt Display */}
                    <div className="flex-1">
                        <div className="text-2xl inline-flex flex-row items-center gap-3 mb-3">
                            <FaCamera />
                            <h2 className="font-semibold text-white">Your Scanned Receipt</h2>
                        </div>
                        <img src={imageUrl!} />
                    </div>

                    {/* Split Receipt */}
                    <div className="flex-1">
                        <div className="text-2xl inline-flex flex-row items-center gap-3 mb-3">
                            <BsFillPeopleFill />
                            <h2 className="font-semibold text-white">Split with Friends</h2>
                        </div>

                        {/* GST and Service Charge Display */}
                        <div className="flex flex-row gap-10">
                            <div>
                                <p className="text-dark-secondary">GST</p>
                                <p className="text-2xl font-semibold text-white">{ receiptData ? `$${receiptData.gst}` : "Loading..." }</p>
                            </div>

                            <div>
                                <p className="text-dark-secondary">Service Charge</p>
                                <p className="text-2xl font-semibold text-white">{ receiptData ? `$${receiptData.serviceCharge}` : "Loading..." }</p>
                            </div>
                        </div>

                        {/*  */}
                    </div>
                </div>
            </div>
            
            { error.isDisplayed && (
                <Toast
                    title="Receipt Processed"
                    description="Your receipt has been processed successfully. You can now split the costs with your friends."
                    hideError = {() => setError({ ...error, isDisplayed: false })}
                />
            ) }
        </div>
    )
}
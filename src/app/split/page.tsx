"use client"
import { useEffect, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import { CreateReceiptModal, ParsedReceipt } from "@/db/types";
import ReceiptDetailModal from "../components/modals/ReceiptDetailModal";
import SideBar from "../components/SideBar";
import { PayMeLahSteps } from "../components/ProgressBar/data";

// React Icons
import { FaMoneyBillWave } from "react-icons/fa";
import { BsFillPeopleFill, BsFillBarChartFill } from "react-icons/bs";
import Toast from "../components/ui/Toast";
import ReceiptItemContainer from "../components/ReceiptItem/ReceiptItemContainer";
import PersonSummaryItem from "../components/PersonSummaryItem";
import ConfirmSaveReceipt from "../components/modals/ConfirmSaveReceipt";

export default function SplitCosts() {
    const router = useRouter();
    const { imageUrl } = useAppData();

    const [ error, setError ] = useState({
        isDisplayed: false,
        title: "",
        description: ""
    });

    const [ receiptData, setReceiptData ] = useState<ParsedReceipt | null>(null);
    const [ receiptItems, setReceiptItems ] = useState<any[]>([]);
    const [ receiptFormData, setReceiptFormData ] = useState<CreateReceiptModal>({
        title: "",
        date: new Date().toLocaleDateString('en-SG'),
        payee: "",
        others: [],
        saveGroup: false
    });
    const [ confirmSharePopup, setConfirmSharePopup ] = useState(false);

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

            if (response.ok) {
                const data = await response.json();
                setReceiptData(data.receipt);
                setReceiptItems(data.receipt.items);
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

    // Handle Receipt Item Share
    const clearItemShares = (itemName: string) => {
        if (!receiptData) return;
        setReceiptItems((items) => {
            // Find the Item to update
            const item = items.find((item) => item.name === itemName);
            if (!item) return items;
            // Clear the shares of the item
            const newItem = {
                ...item,
                shares: []
            };
            // Update the item in the list
            const newItems = items.map((item) => {
                if (item.name === itemName) {
                    return newItem;
                }
                return item;
            });
            return newItems;
        });
    }

    const addReceiptItemShare = (itemName: string, userName: string, share: number) => {
        setReceiptItems((items) => {
            // Find the Item to update
            const item = items.find((item) => item.name === itemName);
            if (!item) return items;
            // Create a new item share
            const newShare = { userName: userName, share: share };
            // Add the new share to the item
            const newItem = {
                ...item,
                shares: item.shares ? [...item.shares, newShare] : [newShare]
            };
            // Update the item in the list
            const newItems = items.map((item) => {
                if (item.name === itemName) {
                    return newItem;
                }
                return item;
            });
            return newItems;
        });
    }

    return (
        <div className="bg-dark-background min-h-screen flex flex-row">
            <SideBar currentStep={PayMeLahSteps.Split} />
            <div className="ml-0 sm:ml-[25%] lg:ml-[20%] flex-1 flex flex-col py-10 p-5 gap-5 border-box max-w-full">
                <header>
                    <h1 className="text-3xl font-bold text-white">Split with your Friends</h1>
                    <p className="text-dark-secondary">Assign items to each friend and share the list with them.</p>
                </header>

                {/* Receipt Details Modal */}
                <div className="p-5 rounded-lg border border-dark-border text-white border-box">
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

                {/* Split Receipt Items */}
                <div className="p-5 rounded-lg border border-dark-border text-white border-box">
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

                    {/* Receipt Items */}
                    <div>
                        { receiptData?.items.map((item, index) => (
                            <ReceiptItemContainer
                                key={index}
                                item={item}
                                people={[...receiptFormData.others, receiptFormData.payee].filter((person) => person !== "")}
                                addReceiptItemShare={addReceiptItemShare}
                                clearItemShares={clearItemShares}
                            />
                        )) }
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full inline-flex flex-row items-center justify-center my-8">
                    <div className="h-[1px] bg-dark-border w-[50vw]" />
                </div>

                {/* Receipt Summary */}
                <div className="text-white">
                    <div className="text-2xl inline-flex flex-row items-center gap-3 mb-3">
                        <BsFillBarChartFill />
                        <h2 className="font-semibold text-white">Summary</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {
                                [...receiptFormData.others, receiptFormData.payee]
                                    .filter((person) => person !== "")
                                    .map((person, index) => (
                                        <PersonSummaryItem
                                            key={index}
                                            name={person}
                                            receiptItems={receiptItems.filter((item) => {
                                                if (!item.shares) return false;
                                                return item.shares.some((share: any) => share.userName === person);
                                            })}
                                        />
                                    ))
                            }
                    </div>
                </div>

                {/* Save Confirmation */}
                <div className="text-white flex flex-col md:flex-row place-content-between">
                    <div>
                        <p className="text-lg font-bold">Done Editing?</p>
                        <p className="text-dark-secondary">You will not be able to edit it after submission (for now...).</p>
                    </div>
                    <button
                        className="bg-dark-accent hover:bg-accent py-2 px-4 rounded-lg duration-150 cursor-pointer"
                        onClick={() => setConfirmSharePopup(true)}
                    >
                        I'm Done!
                    </button>
                </div>
            </div>
            
            { error.isDisplayed && (
                <Toast
                    title={error.title}
                    description={error.description}
                    hideError = {() => setError({ ...error, isDisplayed: false })}
                />
            ) }

            { confirmSharePopup && receiptData !== null && (
                <ConfirmSaveReceipt
                    receiptFormData={receiptFormData}
                    receiptItems={receiptItems}
                    receiptData={receiptData}
                    hideModal={() => setConfirmSharePopup(false)}
                />
            ) }
        </div>
    )
}
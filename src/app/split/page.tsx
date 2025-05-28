"use client"
import { useCallback, useEffect, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import { CreateReceiptModal, ParsedReceipt, ReceiptItem, ReceiptItemShare } from "@/db/types";
import ReceiptDetailModal from "../components/modals/ReceiptDetailModal";
import SideBar from "../components/SideBar";
import { PayMeLahSteps } from "../components/ProgressBar/data";

import Toast from "../components/ui/Toast";
import ReceiptItemContainer from "../components/ReceiptItem/ReceiptItemContainer";
import PersonSummaryItem from "../components/PersonSummaryItem";
import ConfirmSaveReceipt from "../components/modals/ConfirmSaveReceipt";
import { parseReceiptData } from "@/utils/utils";

// React Icons
import { FaMoneyBillWave } from "react-icons/fa";
import { FaHand } from "react-icons/fa6";
import { BsFillPeopleFill, BsFillBarChartFill } from "react-icons/bs";

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
        date: new Date().toLocaleDateString('en-SG').replace(/\//g, "-"),
        payee: "",
        others: [],
        saveGroup: false
    });
    const [ confirmSharePopup, setConfirmSharePopup ] = useState(false);

    // Process Receipt Data based on Image on Init
    useEffect(() => {
        const processReceipt = async () => {
            if (!imageUrl) router.push("/");

            const receiptResponse = await parseReceiptData(imageUrl as string);
            if (receiptResponse) {
                setReceiptData(receiptResponse);
                return;
            }

            // Handle Errors
            setError({
                isDisplayed: true,
                title: "Error Processing Receipt",
                description: "An error occurred while processing the receipt. Please try again."
            });
        }

        processReceipt();
    }, [imageUrl]);

    // Add a new Share to the Receipt Item
    const addItemShare = useCallback((itemName: string, userName: string, userShare: number) => {
        setReceiptData((previous: ParsedReceipt | null) => {
            if (previous === null) return null;

            // Find the Item to update
            const item = previous.items.find((item) => item.name === itemName);
            if (!item) return previous;

            // Create a new item share
            const newShare = { userName: userName, share: userShare };

            // Add the new share to the item
            const newItem = {
                ...item,
                shares: item.shares ? [...item.shares, newShare] : [newShare]
            };

            // Update the item in the list
            const newItems = previous.items.map((item) => {
                if (item.name === itemName) {
                    return newItem;
                }
                return item;
            });

            return {
                ...previous,
                items: newItems
            };
        });
    }, []);

    // Remove all Shares from the Receipt Item
    const clearItemShares = useCallback((itemName: string) => {
        setReceiptData((previous: ParsedReceipt | null) => {
            if (previous === null) return null;

            // Find the Item to update
            const item = previous.items.find((item) => item.name === itemName);
            if (!item) return previous;

            // Clear the shares of the item
            const newItem = {
                ...item,
                shares: []
            };

            // Update the item in the list
            const newItems = previous.items.map((item) => {
                if (item.name === itemName) {
                    return newItem;
                }
                return item;
            });

            return {
                ...previous,
                items: newItems
            };
        })
    }, []);

    // Check if the Receipt can be created
    const handleCreateReceipt = () => {
        if (!receiptData) return;

        // Check if there is at least two people in the receipt
        const numberOfPeople = [...receiptFormData.others, receiptFormData.payee].filter((person) => person !== "").length;
        if (numberOfPeople < 2) {
            setError({
                isDisplayed: true,
                title: "Not Enough People",
                description: "You need at least two people to split the receipt."
            });
            return;
        }

        // Ensure that all items have shares assigned
        for (const item of receiptData.items) {
            if (item.shares.length === 0) {
                setError({
                    isDisplayed: true,
                    title: "Missing Shares",
                    description: `The item "${item.name}" has no shares assigned. Please assign shares before proceeding.`
                });
                return;
            }
        }

        // Check if all fields have been filled
        if (!receiptFormData.title || !receiptFormData.date) {
            setError({
                isDisplayed: true,
                title: "Missing Fields",
                description: "Please fill in all the required fields before proceeding."
            });
            return;
        }
        
        setConfirmSharePopup(true);
    }

    return (
        <div className="bg-dark-background min-h-screen flex flex-col sm:flex-row">
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
                    <div className="flex flex-row gap-10 mb-4">
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
                    { receiptData && (
                        <div className="relative">
                            { receiptData.items.map((item, index) => (
                                <ReceiptItemContainer
                                    key={index}
                                    index={index}
                                    item={item}
                                    people={[...receiptFormData.others, receiptFormData.payee].filter((person) => person !== "")}
                                    addItemShare={addItemShare}
                                    clearItemShares={clearItemShares}
                                />
                            )) }
                            
                            { [...receiptFormData.others, receiptFormData.payee].filter((person) => person !== "").length < 2 && (
                                <div className="absolute top-0 left-0 bg-dark-background/50 backdrop-blur-sm rounded-lg border-dark-border border-2 flex flex-col items-center justify-center w-full h-full">
                                    <div className="md:max-w-1/3 text-center p-5">
                                        <div className="inline-flex flex-row gap-3 text-3xl mb-2">
                                            <FaHand />
                                            <p className="font-bold">Wait!</p>
                                        </div>
                                        <p className="text-dark-secondary">Before proceeding, please ensure that at least two people have been added to the receipt.</p>
                                    </div>
                                </div>
                            ) }
                        </div>
                    ) }
                </div>

                {/* Separator */}
                <div className="w-full inline-flex flex-row items-center justify-center my-8">
                    <div className="h-[1px] bg-dark-border w-[50vw]" />
                </div>

                {/* Receipt Summary */}
                <div className="text-white">
                    <div className="text-2xl inline-flex flex-row items-center gap-3">
                        <BsFillBarChartFill />
                        <h2 className="font-semibold text-white">Summary</h2>
                    </div>
                    <p className="text-dark-secondary mb-3">GST (9%) and Service Charge (10%) will be split depending on the shares assigned to each member.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {
                                receiptData && [...receiptFormData.others, receiptFormData.payee]
                                    .filter((person) => person !== "")
                                    .map((person, index) => (
                                        <PersonSummaryItem
                                            key={index}
                                            name={person}
                                            receiptItems={receiptData.items.filter((item: ReceiptItem) => 
                                                item.shares.some((share: ReceiptItemShare) => share.userName === person)
                                            )}
                                        />
                                    ))
                            }
                    </div>
                </div>

                {/* Save Confirmation */}
                <div className="text-white flex flex-col md:flex-row place-content-between py-5">
                    <div>
                        <p className="text-lg font-bold">Done Editing?</p>
                        <p className="text-dark-secondary">You will not be able to edit it after submission (for now...).</p>
                    </div>
                    <button
                        className="bg-dark-accent hover:bg-accent py-2 px-4 rounded-lg duration-150 cursor-pointer"
                        onClick={handleCreateReceipt}
                    >
                        I&apos;m Done!
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
                    receiptData={receiptData}
                    hideModal={() => setConfirmSharePopup(false)}
                />
            ) }
        </div>
    )
}
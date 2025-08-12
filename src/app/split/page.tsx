"use client"
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "../providers/AppDataProvider";
import { AnimatePresence } from "framer-motion";

import GlassBackground from "@/app/components/ui/GlassBackground"
import GlassSidebar from "@/app/components/GlassSidebar";
import GlassContainer from "@/app/components/ui/GlassContainer";
import ReceiptDetailsModal from "@/app/components/modals/ReceiptDetails";
import ReceiptItemContainer from "@/app/components/ReceiptItem/ReceiptItemContainer";
import PersonSummaryItem from "@/app/components/PersonSummaryItem";
import Toast from "@/app/components/ui/Toast";
import { ParsedReceipt, ReceiptDetails, ReceiptItem, ReceiptItemShare } from "@/db/types";
import { parseReceiptData } from "@/utils/utils";
import { PayMeLahSteps } from "@/app/components/ProgressBar/data";

// React Icons
import { FaMoneyBillWave } from "react-icons/fa";
import { FaHand } from "react-icons/fa6";
import { BsFillPeopleFill, BsFillBarChartFill } from "react-icons/bs";
import ConfirmSaveReceipt from "../components/modals/ConfirmSaveReceipt";
import UpdateReceiptItems from "../components/modals/UpdateReceiptItems";

export default function SplitCosts() {
    const router = useRouter();
    const { imageUrl } = useAppData();
    const [ confirmSharePopup, setConfirmSharePopup ] = useState(false);
    const [ showReceiptItemsModal, setShowReceiptItemsModal ] = useState(false);
    
    // Receipt Details and Parsed Items
    const currentDate = new Date().toISOString().split('T')[0]; // yyyy-MM-dd format
    const [ receiptDetails, setReceiptDetails ] = useState<ReceiptDetails>({
        title: "",
        date: currentDate,
        members: []
    });
    const [ receiptItemDetails, setReceiptItemDetails ] = useState<ParsedReceipt | null>(null);

    // Calculated Memoised Values
    const totalAmount = useMemo<number>(() => {
        if (!receiptItemDetails) return 0;
        
        const itemsTotal = receiptItemDetails.items.reduce((acc, item) => {
            return acc + (item.quantity * item.unitCost);
        }, 0);
        
        return itemsTotal + receiptItemDetails.gst + receiptItemDetails.serviceCharge;
    }, [receiptItemDetails]);
    const availableSubmit = useMemo<boolean>(() => {
        if (!receiptItemDetails || receiptDetails.title === "" || receiptDetails.members.length < 2) {
            return false;
        }

        // Check if all items are fully assigned
        return receiptItemDetails.items.every(item => {
            const totalAssigned = item.shares?.reduce((total, share) => total + share.share, 0) || 0;
            return Math.abs(totalAssigned - item.quantity) <= 0.001;
        });
    }, [receiptItemDetails, receiptDetails]);
    
    // Use ref to track processing state to prevent duplicate API calls
    const processingRef = useRef(false);

    // Error Handling
    const [error, setError] = useState({
        isDisplayed: false,
        title: "",
        description: ""
    });

    // Process Receipt Data based on Image on Init
    useEffect(() => {
        const processReceipt = async () => {
            // Guard clauses to prevent unnecessary processing
            if (!imageUrl || processingRef.current) {
                return;
            }

            if (!imageUrl) {
                router.push("/");
                return;
            }

            processingRef.current = true;

            try {
                const receiptResponse = await parseReceiptData(imageUrl as string);
                if (receiptResponse) {
                    setReceiptItemDetails(receiptResponse);
                } else {
                    // Handle case where parsing failed but no error was thrown
                    setError({
                        isDisplayed: true,
                        title: "Error Processing Receipt",
                        description: "An error occurred while processing the receipt. Please try again."
                    });
                }
            } catch (err) {
                console.error('Error processing receipt:', err);
                // Handle actual errors from parseReceiptData
                setError({
                    isDisplayed: true,
                    title: "Error Processing Receipt",
                    description: "An error occurred while processing the receipt. Please try again."
                });
            } finally {
                processingRef.current = false;
            }
        }

        processReceipt();
    }, [imageUrl, router]);

    // Helper function to update a specific item
    const updateReceiptItem = useCallback((itemName: string, updateFn: (item: ReceiptItem) => ReceiptItem) => {
        setReceiptItemDetails((previous: ParsedReceipt | null) => {
            if (!previous) return null;

            const itemIndex = previous.items.findIndex((item) => item.name === itemName);
            if (itemIndex === -1) return previous;

            const updatedItems = [...previous.items];
            updatedItems[itemIndex] = updateFn(updatedItems[itemIndex]);

            return {
                ...previous,
                items: updatedItems
            };
        });
    }, []);

    // Add a new Share to the Receipt Item
    const addItemShare = useCallback((itemName: string, userName: string, userShare: number) => {
        updateReceiptItem(itemName, (item) => {
            // Check if user already has a share for this item
            const existingShareIndex = item.shares?.findIndex(share => share.userName === userName) ?? -1;
            
            if (existingShareIndex !== -1) {
                // Update existing share
                const updatedShares = [...(item.shares || [])];
                updatedShares[existingShareIndex] = { userName, share: userShare };
                return { ...item, shares: updatedShares };
            } else {
                // Add new share
                const newShare = { userName, share: userShare };
                return {
                    ...item,
                    shares: item.shares ? [...item.shares, newShare] : [newShare]
                };
            }
        });
    }, [updateReceiptItem]);

    // Remove all Shares from the Receipt Item
    const clearItemShares = useCallback((itemName: string) => {
        updateReceiptItem(itemName, (item) => ({
            ...item,
            shares: []
        }));
    }, [updateReceiptItem]);

    // Remove a specific user's share from an item
    const removeItemShare = useCallback((itemName: string, userName: string) => {
        updateReceiptItem(itemName, (item) => ({
            ...item,
            shares: item.shares?.filter(share => share.userName !== userName) || []
        }));
    }, [updateReceiptItem]);

    return (
        <div className="relative h-screen bg-dark-background text-white overflow-hidden">
            <GlassBackground />

            <div className="relative w-full h-full flex flex-col lg:flex-row gap-5 lg:gap-10 p-5 z-10">
                <GlassSidebar step={PayMeLahSteps.Split} />

                <GlassContainer styles="flex-1 p-6 space-y-5 overflow-y-auto no-scrollbar h-full">
                    <div className="mb-5">
                        <h1 className="text-4xl font-bold mb-1">Split with your Friends</h1>
                        <p className="text-dark-secondary md:text-lg">Assign items to each friend and share the list with them.</p>
                    </div>

                    {/* Receipt Details Modal */}
                    <GlassContainer>
                        <div className="text-2xl inline-flex flex-row items-center gap-3">
                            <FaMoneyBillWave />
                            <h2 className="font-semibold">Receipt Details</h2>
                        </div>
                        <p className="text-dark-secondary mb-3">Enter some key details about your receipt to make it easily identifiable</p>
    
                        <ReceiptDetailsModal
                            details={receiptDetails}
                            setDetails={setReceiptDetails}
                            setShowReceiptItemsModal={setShowReceiptItemsModal}
                        />
                    </GlassContainer>

                    {/* Split Receipt Items */}
                    <GlassContainer styles="relative">
                        <div>
                            <div className="text-2xl inline-flex flex-row items-center gap-3 mb-2">
                                <BsFillPeopleFill />
                                <h2 className="font-semibold">Split with Friends</h2>
                            </div>   

                            {/* Receipt Details Display */}
                            <div className="flex flex-col lg:flex-row gap-10 mb-4">
                                <div>
                                    <p className="text-dark-secondary">GST</p>
                                    <p className="text-2xl font-semibold text-white">
                                        {receiptItemDetails ? `$${receiptItemDetails.gst.toFixed(2)}` : "Loading..."}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-dark-secondary">Service Charge</p>
                                    <p className="text-2xl font-semibold text-white">
                                        {receiptItemDetails ? `$${receiptItemDetails.serviceCharge.toFixed(2)}` : "Loading..."}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-dark-secondary">Receipt Total</p>
                                    <p className="text-2xl font-semibold text-white">
                                        {receiptItemDetails ? `$${totalAmount.toFixed(2)}` : "Loading..."}
                                    </p>
                                </div>
                            </div> 

                            {/* Receipt Items Display */}
                            { receiptItemDetails && receiptItemDetails.items.map((item, index) => (
                                <ReceiptItemContainer
                                    key={index}
                                    index={index}
                                    item={item}
                                    people={receiptDetails.members}
                                    addItemShare={addItemShare}
                                    clearItemShares={clearItemShares}
                                    removeItemShare={removeItemShare}
                                />
                            )) }
                        </div>

                        { receiptItemDetails && receiptDetails.members.length < 2 && (
                            <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full backdrop-blur-lg bg-black/40 rounded-lg">
                                <GlassContainer styles="bg-white/5 text-center p-8">
                                    <div className="inline-flex flex-row items-center gap-3 text-4xl mb-4">
                                        <FaHand />
                                        <p className="font-bold">Hold Up!</p>
                                    </div>
                                    <p className="text-gray-200 text-lg leading-relaxed mb-2">
                                        You need at least <span className="font-semibold text-dark-accent">2 people</span> to split the receipt.
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Add more members in the Receipt Details section above to continue.
                                    </p>
                                </GlassContainer>
                            </div>
                        ) }
                    </GlassContainer>

                    {/* Receipt Item Summary */}
                    <GlassContainer>
                        <div className="text-2xl inline-flex flex-row items-center gap-3">
                            <BsFillBarChartFill />
                            <h2 className="font-semibold text-white">Summary</h2>
                        </div>
                        <p className="text-dark-secondary mb-3">GST (9%) and Service Charge (10%) will be split depending on the shares assigned to each member.</p>

                        {/* Personalised Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {
                                receiptItemDetails && receiptDetails.members
                                    .map((member, index) => (
                                        <PersonSummaryItem
                                            key={index}
                                            name={member}
                                            receiptItems={receiptItemDetails.items.filter((item: ReceiptItem) => 
                                                item.shares.some((share: ReceiptItemShare) => share.userName === member)
                                            )}
                                        />
                                    ))
                            }
                        </div>

                        {/* Save Confirmation */}
                        <div className="text-white flex flex-col md:flex-row place-content-between pt-5">
                            <div>
                                <p className="text-lg font-bold">Done Editing?</p>
                                <p className="text-dark-secondary">You will not be able to edit it after submission (for now...).</p>
                            </div>
                            <button
                                className={`text-white py-2 px-6 rounded-lg duration-150 font-bold ${
                                    availableSubmit 
                                        ? 'bg-dark-accent hover:bg-accent cursor-pointer' 
                                        : 'bg-gray-600 cursor-not-allowed'
                                }`}
                                disabled={!availableSubmit}
                                onClick={() => setConfirmSharePopup(true)}
                            >
                                I&apos;m Done!
                            </button>
                        </div>
                    </GlassContainer>
                </GlassContainer>
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {error.isDisplayed && (
                    <Toast
                        title={error.title}
                        description={error.description}
                        hideError={() => setError({ isDisplayed: false, title: "", description: "" })}
                    />
                )}
            </AnimatePresence>

            { confirmSharePopup && receiptItemDetails !== null && (
                <ConfirmSaveReceipt
                    receiptDetails={receiptDetails}
                    receiptItemDetails={receiptItemDetails}
                    hideModal={() => setConfirmSharePopup(false)}
                />
            ) }

            <AnimatePresence>
                { showReceiptItemsModal && receiptItemDetails && (
                    <UpdateReceiptItems
                        receiptItemDetails={receiptItemDetails}
                        setReceiptItemDetails={setReceiptItemDetails}
                        hideModal={() => setShowReceiptItemsModal(false)}
                    />
                ) }
            </AnimatePresence>
        </div>
    )
}
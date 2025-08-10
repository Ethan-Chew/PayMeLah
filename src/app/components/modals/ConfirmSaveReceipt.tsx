"use client";

import { ReceiptDetails, ParsedReceipt } from "@/db/types";
import { useEffect, useState } from "react";
import { GoCopy } from "react-icons/go";
import { FaXmark } from "react-icons/fa6";
import Confetti from 'react-confetti'
import Loader from "../ui/Loader";
import { useAppData } from "@/app/providers/AppDataProvider";
import { saveReceiptToDB } from "@/utils/utils";

interface IConfirmSaveReceiptProps {
    receiptFormData: ReceiptDetails,
    receiptData: ParsedReceipt | null,
    hideModal: () => void,
}

export default function ConfirmSaveReceipt({receiptFormData, receiptData, hideModal }: IConfirmSaveReceiptProps) {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isConfetti, setIsConfetti ] = useState(false);
    const [ hasCopied, setHasCopied ] = useState(false);

    const { savedReceiptId, setSavedReceiptId } = useAppData();

    useEffect(() => {
        const saveToDB = async () => {
            if (!receiptData) return; 

            const receiptId = await saveReceiptToDB(receiptFormData, receiptData);
            setSavedReceiptId(receiptId);
            setIsLoading(false);
            setTimeout(() => {
                setIsConfetti(true);
            }, 1500);
        }
        if (savedReceiptId === null) {
            saveToDB();
        }
    }, [receiptFormData, receiptData, savedReceiptId, setSavedReceiptId]);

    const copyText = () => {
        if (savedReceiptId === null) return;
        const url = `${process.env.NEXT_PUBLIC_WEB_URL}/receipt/${savedReceiptId}`;
        navigator.clipboard.writeText(url);
        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }

    return (
        <div className="z-50 fixed inset-0 top-0 left-0 w-screen h-screen bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <div className="z-[60] relative bg-dark-background border border-dark-border text-white rounded-lg shadow-lg m-10">
                <h2 className="text-2xl font-semibold px-5 py-4 border-b border-dark-border pr-20">Share the receipt with your friends</h2>
                <div className="px-5 py-4">
                    { !isLoading ? (
                        <>
                            <div className="p-3 border border-dark-border rounded-lg flex flex-row gap-3 place-content-between items-center mb-2">
                                <p>{process.env.NEXT_PUBLIC_WEB_URL}/receipt/{savedReceiptId}</p>
                                <button
                                    className="text-xl cursor-pointer text-dark-secondary"
                                    onClick={() => copyText()}
                                >
                                    <GoCopy />
                                </button>
                            </div>
                            <p className="text-dark-secondary text-sm">Anyone with this link can view the Receipt publicly.</p>
                        </>
                    ) : (
                        <div className="inline-flex flex-row gap-5 items-center text-white">
                            <Loader />
                            <p>Hang On! We&apos;re saving your receipt.</p>
                        </div>
                    ) }
                    { hasCopied && (
                        <p className="py-2 text-dark-accent">URL Copied to your Clipboard!</p>
                    ) }
                    { !isLoading && (
                        <div className="mt-5 flex flex-row justify-end">
                            <button
                                className="bg-dark-accent hover:bg-accent duration-150 rounded-lg py-2 px-5 cursor-pointer"
                                onClick={copyText}
                            >
                                Copy Link
                            </button>
                        </div>
                    )   }
                </div>
                <FaXmark
                    className="absolute top-5 right-5 text-dark-secondary cursor-pointer text-xl"
                    onClick={hideModal}
                />
            </div>
            { isConfetti && (
                <Confetti 
                    className="z-40 w-screen h-screen fixed top-0 left-0"
                />
            ) }
        </div>
    )
}
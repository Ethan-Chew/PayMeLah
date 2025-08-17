"use client";

import { ReceiptDetails, ParsedReceipt } from "@/db/types";
import { useEffect, useState, Fragment } from "react";
import { GoCopy } from "react-icons/go";
import Confetti from 'react-confetti'

import { useAppData } from "@/app/providers/AppDataProvider";
import { FaSpinner } from "react-icons/fa6";
import GlassContainer from "@/app/components/ui/GlassContainer";
import { saveReceiptToDB } from "@/utils/utils";

interface IConfirmSaveReceiptProps {
    receiptDetails: ReceiptDetails,
    receiptItemDetails: ParsedReceipt | null,
    hideModal: () => void,
}

export default function ConfirmSaveReceipt({ receiptDetails, receiptItemDetails }: IConfirmSaveReceiptProps) {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isConfetti, setIsConfetti ] = useState(false);
    const [ hasCopied, setHasCopied ] = useState(false);

    const { savedReceiptId, setSavedReceiptId } = useAppData();

    useEffect(() => {
        const saveToDB = async () => {
            if (!receiptDetails || !receiptItemDetails) return;

            const receiptId = await saveReceiptToDB(receiptDetails, receiptItemDetails);
            setSavedReceiptId(receiptId);
            setIsLoading(false);
            setTimeout(() => {
                setIsConfetti(true);
            }, 1500);
        }
        if (savedReceiptId === null) {
            saveToDB();
        }
    }, [receiptDetails, receiptItemDetails, savedReceiptId, setSavedReceiptId]);

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
        <div className="z-50 fixed inset-0 top-0 left-0 w-screen h-screen bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <GlassContainer styles="z-60 flex flex-col">
                <div className="inline-flex flex-row justify-between gap-5 border-b border-white/20 pb-3 mb-3">
                    <h2 className="text-2xl font-semibold ">Share the receipt with your friends</h2>
                    {/* <FaXmark
                        className="text-dark-secondary cursor-pointer text-xl"
                        onClick={hideModal}
                    /> */}
                </div>
                { !isLoading ? (
                    <Fragment>
                        <GlassContainer styles="p-3 flex flex-row gap-3 place-content-between items-center mb-2">
                            <p>{process.env.NEXT_PUBLIC_WEB_URL}/receipt/{savedReceiptId}</p>
                            <button
                                className="text-xl cursor-pointer text-dark-secondary"
                                onClick={() => copyText()}
                            >
                                <GoCopy />
                            </button>
                        </GlassContainer>
                        <p className="text-dark-secondary text-sm">Anyone with this link can view the Receipt publicly.</p>
                    </Fragment>
                ) : (
                    <div className="inline-flex flex-row gap-5 py-3 items-center text-white">
                        <FaSpinner className="text-2xl text-white animate-spin" />
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
            </GlassContainer>
            
            { isConfetti && (
                <Confetti 
                    className="z-40 w-screen h-screen fixed top-0 left-0"
                />
            ) }
        </div>
    )
}
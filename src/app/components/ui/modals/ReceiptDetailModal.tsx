"use client"
import { useState } from "react"
import NameInput from "../NameInput";
import { FaArrowRight } from "react-icons/fa6";

interface IReceiptDetailModal {
    isSetup: boolean,
    setIsSetup: (val: boolean) => void,
    isLoading: boolean,
}

export default function ReceiptDetailModal({ isSetup, setIsSetup, isLoading}: IReceiptDetailModal) {
    const [ receiptTitle, setReceiptTitle ] = useState("");
    const [ leaderName, setLeaderName ] = useState("");
    const [ addedNames, setAddedNames ] = useState<string[]>([]);

    const addName = (name: string) => {
        if (name && !addedNames.includes(name)) {
            setAddedNames([...addedNames, name]);
        }
    }

    const removeName = (name: string) => {
        setAddedNames((names) => {
            return names.filter((n) => n !== name);
        });
    }

    const handleSubmit = (e: React.MouseEventHandler<HTMLButtonElement>) => {


    }

    return (
        <div className="fixed top-0 left-0 z-50 min-w-screen min-h-screen bg-dark-background text-white p-10">
            <div className="pb-10">
                <h1 className="text-3xl font-semibold">One More Step..</h1>
                <p className="text-dark-secondary">Enter some key details about your receipt you would like to share</p>
            </div>

            <form className="flex flex-col gap-4 w-full">
                <div className="w-full">
                    <p className="text-lg font-semibold mb-2">Receipt Title</p>
                    <input
                        className="px-4 py-2 border border-dark-border w-full focus:outline-none"
                        placeholder="The Amazing Restaurant"
                        value={receiptTitle}
                        onChange={(e) => setReceiptTitle(e.target.value)}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Restaurant/Store's Name</p>
                </div>

                <div className="w-full">
                    <p className="text-lg font-semibold mb-2">Who Paid?</p>
                    <input
                        className="px-4 py-2 border border-dark-border w-full focus:outline-none"
                        placeholder=""
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Name of the Person who Paid</p>
                </div>

                <div className="w-full">
                    <p className="text-lg font-semibold mb-2">Others with you</p>
                    <NameInput
                        names={addedNames}
                        addName={addName}
                        removeName={removeName}
                    />
                    <p className="text-dark-secondary text-sm mt-1">Others who are supposed to pay</p>
                </div>

                <div className="mt-5 space-y-3">
                    { isLoading ? (
                        <div className="border border-red-500 text-red-500 duration-100 animate-pulse text-center p-2 rounded-lg">
                            Your receipt is still being processed! If this message persists, please contact me!
                        </div>
                    ) : (
                        <div className="border border-green-500 text-green-500 duration-100 animate-pulse text-center p-2 rounded-lg">
                            Your receipt has been processed! 
                        </div>
                    ) }
                    <button
                        className="p-2 text-white bg-dark-accent dark:bg-accent cursor-pointer inline-flex flex-row gap-3 items-center justify-center w-full rounded-lg"
                        // onClick={handleSubmit}
                    >
                        <p>Continue</p>
                        <FaArrowRight />
                    </button>
                </div>
            </form>
        </div>
   )
}
"use client";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CustomSplitContainer from "./CustomSplitContainer";
import { IReceiptItem } from "./IReceiptItem";

export default function ReceiptItemContainer({ item, index, people, addItemShare, clearItemShares }: IReceiptItem & { index: number }) {
    const [ selectedPerson, setSelectedPerson ] = useState<string | "select" | "split" | "custom">("select");
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);

    // Calculate if item is fully assigned
    const isNotFullyAssigned = () => {
        if (selectedPerson === "select") {
            return true;
        }
        
        const totalAssigned = item.shares?.reduce((total, share) => total + share.share, 0) || 0;
        return Math.abs(totalAssigned - item.quantity) > 0.001;
    };

    useEffect(() => {
        clearItemShares(item.name);
        switch (selectedPerson) {
            case "select":
                return;
            case "split":
                const share = item.quantity / people.length;
                for (const person of people) {
                    addItemShare(item.name, person, share);
                }
                return;
            default:
                if (selectedPerson !== "custom") {
                    addItemShare(item.name, selectedPerson, item.quantity);
                }
                return;
        }
    }, [selectedPerson, item.name, item.quantity, people]);

    return (
        <div className={`py-5 ${index === 0 ? "border-y" : "border-b"} border-white/20`}>
            <div className="flex flex-col gap-3 md:flex-row md:place-content-between md:items-center">
                <div>
                    <p className="text-xl font-semibold">{ item.name }</p>
                    <p className="text-dark-secondary">{ item.quantity } item{ item.quantity === 1 ? "" : "s" } @ ${item.unitCost.toFixed(2)}</p>
                </div>

                <div className="inline-flex flex-row gap-3">
                    <select
                        className="px-3 py-2 rounded-lg border border-white/20"
                        value={selectedPerson}
                        onChange={(e) => setSelectedPerson(e.target.value)}
                    >
                        <option value="select" className="text-black">Select</option>
                        { people.map((person, index) => (
                            <option key={index} value={person} className="text-black">{ person }</option>
                        )) }
                        <option value="split" className="text-black">Split Equally</option>
                        <option value="custom" className="text-black">Custom Split</option>
                    </select>
                    <AnimatePresence>
                        { selectedPerson === "custom" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }} 
                                className="p-3 rounded-full border border-white/20 text-white"
                                onClick={() => setIsModalOpen(!isModalOpen)}
                            >
                                { isModalOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </motion.div>
                        ) }
                    </AnimatePresence>
                </div>
            </div>

            {/* Not Fully Assigned Warning */}
            <AnimatePresence>
                { isNotFullyAssigned() && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg flex items-center gap-2"
                    >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <p className="text-yellow-200 font-medium">Not Fully Assigned</p>
                    </motion.div>
                ) }
            </AnimatePresence>

            <AnimatePresence>
                { selectedPerson === "custom" && isModalOpen && (
                    <CustomSplitContainer
                        item={item}
                        people={people}
                        addItemShare={addItemShare}
                        clearItemShares={clearItemShares}
                    />
                ) }
            </AnimatePresence>
        </div>
    )
}
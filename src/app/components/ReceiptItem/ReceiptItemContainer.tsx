"use client";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CustomSplitContainer from "./CustomSplitContainer";
import { IReceiptItem } from "./IReceiptItem";

export default function ReceiptItemContainer({ item, index, people, addItemShare, clearItemShares }: IReceiptItem & { index: number }) {
    const [ selectedPerson, setSelectedPerson ] = useState<string>("select");
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);

    useEffect(() => {
        if (selectedPerson === "select") return;

        // Handle Split Equally
        if (selectedPerson === "split") {
            const share = item.quantity / people.length;
            for (const person of people) {
                addItemShare(item.name, person, share);
            }
            return;
        }

        // Handle Individual Split
        if (selectedPerson !== "custom") {
            addItemShare(item.name, selectedPerson, item.quantity);
            return;
        }

    }, [selectedPerson, item.name, item.quantity, people.length, addItemShare]);

    return (
        <div className={`py-5 ${index === 0 ? "border-y" : "border-b"} border-dark-border`}>
            <div className="flex flex-row place-content-between items-center">
                <div>
                    <p className="text-xl font-semibold">{ item.name }</p>
                    <p className="text-dark-secondary">{ item.quantity } item{ item.quantity === 1 ? "" : "s" } @ ${item.unitCost.toFixed(2)}</p>
                </div>

                <div className="inline-flex flex-row gap-3">
                    <select
                        className="px-3 py-2 rounded-lg border border-dark-border"
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
                                className="p-3 rounded-full border border-dark-border text-white"
                                onClick={() => setIsModalOpen(!isModalOpen)}
                            >
                                { isModalOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </motion.div>
                        ) }
                    </AnimatePresence>
                </div>
            </div>

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
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Stepper from "../ui/Stepper";
import { IReceiptItem } from "./IReceiptItem";

export default function CustomSplitContainer({ item, people, addItemShare, clearItemShares }: IReceiptItem) {
    const [ splitPeopleInfo, setSplitPeopleInfo ] = useState<{ name: string, amount: number }[]>(people.map((person) => ({ name: person, amount: 0 })));
    const [ status, setStatus ] = useState({
        isError: false,
        message: ""
    })

    const updatePeopleCount = (name: string, amount: number) => {
        setSplitPeopleInfo((prev) => {
            const newPeopleInfo = [...prev];
            const index = newPeopleInfo.findIndex((person) => person.name === name);
            if (index !== -1) {
                newPeopleInfo[index].amount = amount;
            }
            return newPeopleInfo;
        });
    }

    useEffect(() => {
        let total = 0;
        for (const person of splitPeopleInfo) {
            total += person.amount;
        }

        if (total !== item.quantity) {
            setStatus({
                isError: true,
                message: `Total amount must be equal to ${item.quantity}.`
            });
        } else {
            setStatus({
                isError: false,
                message: 'Quantity is valid!'
            });

            // Clear and Add Item Shares
            clearItemShares(item.name);
            for (const person of splitPeopleInfo) {
                if (person.amount > 0) {
                    addItemShare(item.name, person.name, person.amount);
                }
            }
        }
    }, [splitPeopleInfo, item.quantity, item.name, addItemShare, clearItemShares]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-3 p-3 rounded-lg border border-dark-accent text-white"
        >
            <p className="text-lg font-semibold text-dark-accent mb-3">Assign by Person</p>

            { splitPeopleInfo.map((person, index) => (
                <div key={index} className="flex flex-col gap-1 md:flex-row py-2 place-content-between">
                    <div className="inline-flex flex-row gap-3">
                        <p className="h-8 w-8 bg-dark-accent rounded-full flex items-center justify-center font-semibold">{ person.name[0].toUpperCase() }</p>
                        <p className="text-lg font-semibold">{ person.name }</p>
                    </div>

                    <div className="inline-flex flex-row gap-5 items-center">
                        <p
                            className="text-lg font-semibold text-white"
                        >${ item.unitCost * person.amount }</p>
                        <Stepper
                            step={person.amount}
                            updateStep={(val) => updatePeopleCount(person.name, val) }
                        />
                    </div>
                </div>
            ))}

            { status.message !== "" && (
                <p className={`${status.isError ? "text-red-500" : "text-green-700"} font-semibold animate-pulse`}>{ status.message }</p>
            ) }
        </motion.div>
    )
}
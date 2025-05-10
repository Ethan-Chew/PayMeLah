"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

interface IToast {
    title: string,
    description: string,
    hideError: () => void
}

export default function Toast({ title, description, hideError }: IToast) {
    const maxTime = 5;
    const [timer, setTimer] = useState<number>(maxTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));

            if (timer === 0) {
                hideError();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-5 right-5 bg-dark-background shadow-lg rounded-lg w-80">
            <div className="p-4">
                <div className="flex flex-row place-content-between text-white items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <FaXmark
                        className="cursor-pointer"
                        onClick={hideError}
                    />
                </div>
                <p className="text-sm text-dark-secondary">{description}</p>
            </div>

            <motion.div
                className="bg-red-600 h-1 rounded-b-lg"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: maxTime, ease: "linear" }}
            />
        </div>
    );
}
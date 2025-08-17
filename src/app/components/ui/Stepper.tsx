"use client";
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function Stepper({ step, updateStep }: { step: number, updateStep: (val: number) => void }) {
    return (
        <div className="inline-flex h-full gap-2 items-center">
            <div
                className="cursor-pointer h-full p-2 flex items-center justify-center rounded-lg border border-white/20 text-white"
                onClick={() => {
                    if (step > 0) {
                        updateStep(step - 1);
                    }
                }}
            >
                <FaMinus />
            </div>
            <input
                className="text-center border border-white/20 text-white rounded-lg h-full p-2 max-w-[90px]"
                type="number"
                value={step}
                onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                        updateStep(value);
                    }
                }}
            />
            <div
                className="cursor-pointer h-full p-2 flex items-center justify-center rounded-lg border border-white/20 text-white"
                onClick={() => {
                    updateStep(step + 1);
                }}
            >
                <FaPlus />
            </div>
        </div>
    )
}
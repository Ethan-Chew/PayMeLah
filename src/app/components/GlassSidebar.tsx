"use client"
import GlassContainer from "./ui/GlassContainer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react"
import { IoMenu } from "react-icons/io5";
import { PayMeLahSteps } from "./ProgressBar/data";
import MobileProgressBar from "./ProgressBar/MobileProgressBar";
import DesktopProgressBar from "./ProgressBar/DesktopProgressBar";

interface IGlassSidebar {
    step: PayMeLahSteps;
}

export default function GlassSidebar({ step }: IGlassSidebar) {
    const [ isHidden, setIsHidden ] = useState(false);

    return (
        <AnimatePresence>
            { !isHidden && (
                <motion.div
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                >
                    <GlassContainer styles="h-full flex flex-col lg:justify-between">
                        <div>
                            <button
                                className="hidden lg:block p-1 bg-white/10 border-white/60 border-2 rounded-lg text-3xl lg:text-4xl mb-3 cursor-pointer"
                                onClick={() => setIsHidden(true)}
                            >
                                <IoMenu />
                            </button>
                            <p className="text-2xl md:text-3xl font-bold mb-3 lg:mb-0">PayMeLah!</p>
                            <p className="hidden lg:block text-dark-secondary lg:mb-auto">Split shared expenses with your friends, easily.</p>
                        </div>

                        <MobileProgressBar currentStep={step} />
                        <DesktopProgressBar currentStep={step} />
                    </GlassContainer>
                </motion.div>
            ) }
        </AnimatePresence>
    )
}
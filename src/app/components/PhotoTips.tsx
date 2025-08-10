"use client"
import { useState } from "react"
import GlassContainer from "./ui/GlassContainer"
import { FaChevronDown } from "react-icons/fa6";

export default function PhotoTips() {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <GlassContainer styles="text-white lg:max-w-md">
            <div className={`flex items-center justify-between ${isExpanded ? 'mb-3' : 'mb-0'} lg:mb-3`}>
                <h2 className="text-xl md:text-2xl font-bold">📷 Capturing a Good Photo</h2>
                <button 
                    className={`lg:hidden text-white cursor-pointer text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Hide photo tips" : "Show photo tips"}
                >
                    <FaChevronDown />
                </button>
            </div>

            <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
                <div>
                    <p className="text-xl font-semibold text-white">Avoid Unnecessary Distractions</p>
                    <p className="text-dark-secondary">Ensure the frame includes only the receipt—remove any other items from view.</p>
                </div>
                
                <div>
                    <p className="text-xl font-semibold text-white">Fitting the Receipt</p>
                    <p className="text-dark-secondary">Ensure the whole receipt is visible and within the frame.</p>
                </div>
                
                <div>
                    <p className="text-xl font-semibold text-white">Ensure Good Lighting</p>
                    <p className="text-dark-secondary">Lighting should be balanced—not too bright or too dim—so all text on the receipt is clearly legible.</p>
                </div>
                
                <div>
                    <p className="text-xl font-semibold text-white">Keep the Receipt Flat</p>
                    <p className="text-dark-secondary">Lay the receipt on a flat surface without folds or wrinkles to ensure all text is visible.</p>
                </div>
            </div>
        </GlassContainer>
    )
}
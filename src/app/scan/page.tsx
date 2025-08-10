"use client"
import { useState } from "react";
import { useAppData } from "@/app/providers/AppDataProvider";
import { useRouter } from "next/navigation";

import GlassBackground from "@/app/components/ui/GlassBackground";
import GlassSidebar from "@/app/components/GlassSidebar";
import GlassContainer from "@/app/components/ui/GlassContainer";
import CameraCapture from "../components/FileManagement/CameraCapture";
import DragAndDrop from "@/app/components/FileManagement/DragAndDrop";

import { PayMeLahSteps } from "@/app/components/ProgressBar/data";
import { MdOutlineFileUpload, MdOutlineCameraAlt } from "react-icons/md";

export default function ScanUploadReceipt() {
    const router = useRouter();
    const { imageUrl, setImageUrl } = useAppData();
    const [ selectedTab, setSelectedTab ] = useState<"Scan" | "Upload">("Scan");

    return (
        <div className="relative min-h-screen min-w-screen bg-dark-background text-white">
            <GlassBackground />

            <div className="relative w-full flex flex-col lg:flex-row gap-5 lg:gap-10 p-5 z-10">
                <GlassSidebar step={PayMeLahSteps.Scan} />

                <GlassContainer styles="flex-1 p-6 overflow-y-scroll no-scrollbar">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">Capture your Receipt</h1>
                            <p className="text-dark-secondary md:text-lg">Take a Clear Photo for us to analyse and determine items purchased</p>
                        </div>
                        
                        { imageUrl && (
                            <button
                                className="bg-dark-accent text-white px-6 py-2 rounded-lg mt-4 duration-200 cursor-pointer hover:shadow-[0_0_10px_rgba(45,200,197,0.3)] transition-shadow font-semibold"
                                onClick={() => router.push("/split")}
                            >Continue</button>
                        ) }
                    </div>

                    <div className="flex flex-row gap-3 my-5">
                        <Tab isSelected={selectedTab === "Scan"} setIsSelected={setSelectedTab} title="Scan" icon={<MdOutlineFileUpload className="text-xl" />} />
                        <Tab isSelected={selectedTab === "Upload"} setIsSelected={setSelectedTab} title="Upload" icon={<MdOutlineCameraAlt className="text-xl" />} />
                    </div>

                    { selectedTab === "Scan" ? (
                        <DragAndDrop imageUrl={imageUrl} setImageUrl={setImageUrl} />
                    ) : (
                        <CameraCapture imageUrl={imageUrl} setImageUrl={setImageUrl} />
                    ) }
                </GlassContainer>
            </div>
        </div>
    )
}

function Tab({ isSelected, setIsSelected, title, icon }: { isSelected: boolean, setIsSelected: (tab: "Scan" | "Upload") => void, title: string, icon: React.ReactNode }) {
    return (
        <button
            className={`inline-flex flex-1 items-center justify-center gap-2 p-2 rounded-lg text-lg text-white cursor-pointer ${isSelected ? "bg-dark-accent" : "bg-white/5 backdrop-blur-lg border-2 border-white/20"}`}
            onClick={() => setIsSelected(title as "Scan" | "Upload")}
        >
            {icon}
            <span>{title}</span>
        </button>
    )
}
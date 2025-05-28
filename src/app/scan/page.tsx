"use client";
import { useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import DragAndDrop from "../components/FileManagement/DragAndDrop";
import CameraCapture from "../components/FileManagement/CameraCapture";

export default function ReceiptScanning() {
    const router = useRouter();
    const { imageUrl, setImageUrl } = useAppData();
    const [ selectedTab, setSelectedTab ] = useState<"Scan" | "Upload">("Scan");

    return (
        <div className="bg-dark-background min-h-screen flex flex-col sm:flex-row">
            <SideBar />
            <div className="ml-0 sm:ml-[25%] lg:ml-[20%] flex-1 flex flex-col gap-5 p-5 sm:p-10 box-border">
                <div className="text-white">
                    <h1 className="font-semibold text-3xl mb-1">Capture your Receipt</h1>
                    <p className="text-dark-secondary">Taking a Clear Photo for us to Analyse</p>
                </div>

                <div className="w-full flex flex-row gap-5 mb-5">
                    <button
                        className={`flex-1 p-3 text-white hover:font-semibold duration-150 rounded-lg cursor-pointer ${selectedTab === "Scan" ? "font-semibold bg-dark-accent" : "hover:bg-neutral-800 border border-dark-border"}`}
                        onClick={() => {
                            setImageUrl(null);
                            setSelectedTab("Scan");
                        }}
                    >
                        Upload
                    </button>
                    <button
                        className={`flex-1 p-3 text-white hover:font-semibold duration-150 rounded-lg cursor-pointer ${selectedTab === "Upload" ? "font-semibold bg-dark-accent" : "hover:bg-neutral-800 border-dark-border"}`}
                        onClick={() => {
                            setImageUrl(null);
                            setSelectedTab("Upload")
                        }}
                    >
                        Scan
                    </button>
                </div>
                { selectedTab === "Scan" ? (
                    <DragAndDrop
                        setImageUrl={setImageUrl}
                    />
                ) : (
                    <CameraCapture
                        setImageUrl={setImageUrl}
                        imageUrl={imageUrl}
                    />
                )}

                { !!imageUrl && (
                    <button
                        className="bg-dark-accent hover:bg-accent text-white rounded-lg p-3 text-semibold duration-150"
                        onClick={() => router.push("/split")}
                    >Continue</button>
                ) }
            </div>
        </div>
    );
}

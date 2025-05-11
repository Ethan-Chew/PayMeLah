"use client";
import { TiCameraOutline } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";

export default function ReceiptScanning() {
    const router = useRouter();
    const { imageUrl, setImageUrl } = useAppData();
    const [ selectedTab, setSelectedTab ] = useState<"Scan" | "Upload">("Scan");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setMediaStream(stream);
        } catch (error) {
            console.error("Error accessing webcam", error);
        }
    };

    const stopWebcam = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const width = video.videoWidth;
            const height = video.videoHeight;
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, width, height);
                const imageData = canvas.toDataURL("image/png");
                setImageUrl(imageData);
            }
        }
    };

    const resetTakenImage = () => {
        setImageUrl(null);
        startWebcam();
    }

    const handleSubmit = async () => {
        if (!imageUrl) return;
        stopWebcam();
        router.push("/split");
    }

    useEffect(() => {
        return () => stopWebcam();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen w-screen flex flex-row">
            <SideBar />
            <div className="ml-0 sm:ml-[25%] lg:ml-[20%] flex-1 flex flex-col items-center justify-center gap-5">
                <h1 className="text-white font-semibold text-3xl">Capture your Receipt</h1>

                <div className="md:w-[50%]">
                    <div className="w-full flex flex-row gap-5">
                        <button
                            className={`flex-1 p-3 text-white hover:font-semibold duration-150 rounded-lg cursor-pointer ${selectedTab === "Scan" ? "font-semibold bg-dark-accent" : "hover:bg-neutral-800"}`}
                            onClick={() => {
                                stopWebcam();
                                setSelectedTab("Scan");
                            }}
                        >
                            Upload
                        </button>
                        <button
                            className={`flex-1 p-3 text-white hover:font-semibold duration-150 rounded-lg cursor-pointer ${selectedTab === "Upload" ? "font-semibold bg-dark-accent" : "hover:bg-neutral-800"}`}
                            onClick={() => {
                                startWebcam();
                                setSelectedTab("Upload")
                            }}
                        >
                            Scan
                        </button>
                    </div>
                    { selectedTab === "Scan" ? (
                        <div className="mt-5 w-full flex flex-col gap-2 items-center justify-center text-white border-2 border-lg border-dashed border-neutral-700 hover:border-neutral-500 p-10 px-20 duration-150">
                            <IoCameraOutline className="text-5xl text-dark-secondary" />
                            <div>
                                <p className="text-xl font-semibold mb-1">Upload your Receipt</p>
                                <p className="text-dark-secondary">Supports JPG and PNG files</p>
                            </div>
                            <button
                                className="text-lg px-6 py-2 inline-flex flex-row items-center gap-2 text-white bg-accent cursor-pointer rounded-lg"    
                            >
                                <MdOutlineFileUpload className="text-xl" />
                                <p>Upload</p>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-full m-4 md:m-0">
                                { !imageUrl && (
                                    <video
                                        id="video"
                                        autoPlay
                                        playsInline
                                        ref={videoRef}
                                        className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-auto h-full md:max-w-[50vw] box-border"
                                    />
                                ) }

                                { imageUrl && (
                                    <img
                                        alt="Captured Image"
                                        src={decodeURIComponent(imageUrl)}
                                        className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-full h-full md:max-w-[50vw]"
                                    />
                                ) }
                            </div>
                            <div className="mt-5 bg-dark-container flex flex-row gap-5 lg:w-[25vw] px-10 py-2 rounded-full items-center justify-center">
                                <button
                                    className="text-dark-secondary hover:text-white hover:font-semibold duration-150"
                                >
                                    Upload
                                </button>

                                <button
                                    className={`text-3xl p-3 ${!!imageUrl ? "bg-neutral-800" : "bg-dark-accent"} text-white rounded-full cursor-pointer`}
                                    onClick={() => captureImage()}
                                    disabled={!!imageUrl}
                                >
                                    <TiCameraOutline />
                                </button>

                                <button
                                    className="text-dark-secondary hover:text-white hover:font-semibold duration-150 disabled:cursor-not-allowed"
                                    disabled={!imageUrl}
                                    onClick={resetTakenImage}
                                >
                                    Retake
                                </button>
                            </div>
                        </>
                    )}

                    { !!imageUrl && (
                        <button
                            className="bg-dark-accent text-white rounded-lg m-4 p-3 text-semibold duration-150"
                            onClick={handleSubmit}
                        >Lorum Ipsum LOL</button>
                    ) }
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}

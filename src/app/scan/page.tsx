"use client";
import { TiCameraOutline } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "../providers/AppDataProvider";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";

export default function ReceiptScanning() {
    const router = useRouter();
    const { imageUrl, setImageUrl } = useAppData();

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
        router.push("/split");
    }

    useEffect(() => {
        startWebcam();
        return () => stopWebcam();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen w-screen flex flex-row">
            <SideBar />
            <div className="ml-0 sm:ml-[25%] lg:ml-[20%] flex-1 flex flex-col items-center justify-center gap-5">
                <h1 className="text-white font-semibold text-3xl">Capture your Receipt</h1>
                <div className="m-4 md:m-0">
                    { !imageUrl && (
                        <video
                            id="video"
                            autoPlay
                            playsInline
                            ref={videoRef}
                            className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-auto h-full md:max-w-[50vw] md:aspect-video box-border"
                        />
                    ) }

                    { imageUrl && (
                        <img
                            alt="Captured Image"
                            src={decodeURIComponent(imageUrl)}
                            className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-full h-full md:max-w-[50vw] md:aspect-video"
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

                { !!imageUrl && (
                    <button
                        className="bg-dark-accent text-white rounded-lg m-4 p-3 text-semibold duration-150"
                        onClick={handleSubmit}
                    >Lorum Ipsum LOL</button>
                ) }

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}

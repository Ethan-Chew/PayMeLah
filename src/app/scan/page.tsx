"use client";
import { TiCameraOutline } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

export default function ReceiptScanning() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
                setCapturedImage(imageData);
            }
        }
    };

    const resetTakenImage = () => {
        setCapturedImage(null);
        startWebcam();
    }

    useEffect(() => {
        startWebcam();
        return () => stopWebcam();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-white font-semibold text-3xl">Capture your Receipt</h1>
            <div className="m-4 md:m-0">
                { !capturedImage && (
                    <video
                        id="video"
                        autoPlay
                        playsInline
                        ref={videoRef}
                        className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-auto h-full md:max-w-[50vw] md:aspect-video box-border"
                    />
                ) }

                { capturedImage && (
                    <img
                        alt="Captured Image"
                        src={decodeURIComponent(capturedImage)}
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
                    className={`text-3xl p-3 ${!!capturedImage ? "bg-neutral-800" : "bg-dark-accent"} text-white rounded-full cursor-pointer`}
                    onClick={() => captureImage()}
                    disabled={!!capturedImage}
                >
                    <TiCameraOutline />
                </button>

                <button
                    className="text-dark-secondary hover:text-white hover:font-semibold duration-150 disabled:cursor-not-allowed"
                    disabled={!capturedImage}
                    onClick={resetTakenImage}
                >
                    Retake
                </button>
            </div>

            { !!capturedImage && (
                <button
                    className="bg-dark-accent text-white rounded-lg m-4 p-3 text-semibold duration-150"
                >Lorum Ipsum LOL</button>
            ) }

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}

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

    useEffect(() => {
        startWebcam();
        return () => stopWebcam();
    }, []);

    return (
        <div className="bg-dark-background min-h-screen flex flex-col items-center justify-center">
            <div className="border-2 dark:border-dark-border rounded-lg overflow-hidden w-full max-w-[50vw] aspect-video">
                { !capturedImage && (
                    <video
                        id="video"
                        autoPlay
                        playsInline
                        ref={videoRef}
                        className="w-full h-full object-cover"
                    />
                ) }
                { capturedImage && (
                    <img alt="Captured Image" src={decodeURIComponent(capturedImage)} className="w-full h-full object-cover" />
                ) }
            </div>
            <div className="mt-5 bg-dark-container flex flex-row gap-5 lg:w-[25vw] px-10 py-2 rounded-full items-center justify-center">
                <button
                    className="text-dark-secondary hover:text-white hover:font-semibold duration-150"
                >
                    Upload
                </button>

                <button
                    className="text-3xl p-3 bg-dark-accent text-white rounded-full cursor-pointer"
                    onClick={() => captureImage()}
                >
                    <TiCameraOutline />
                </button>

                <button
                    className="text-dark-secondary hover:text-white hover:font-semibold duration-150 disabled:cursor-not-allowed"
                    disabled={!capturedImage}
                    onClick={() => setCapturedImage(null)}
                >
                    Retake
                </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}

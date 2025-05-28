"use client";
import { isMobilePhone } from "@/utils/isMobilePhone";
import { useCallback, useEffect, useRef, useState } from "react";
import { TiCameraOutline } from "react-icons/ti";

interface ICameraCapture {
    setImageUrl: (imageUrl: string | null) => void;
    imageUrl: string | null;
}

export default function CameraCapture({ setImageUrl, imageUrl }: ICameraCapture) {    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const startWebcam = useCallback(async () => {
        try {
            const constraints = isMobilePhone()
                ? { video: { facingMode: { ideal: "environment" } } }
                : { video: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setMediaStream(stream);
        } catch (error) {
            console.error("Error accessing webcam", error);
        }
    }, []);

    const stopWebcam = useCallback(() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
    }, [mediaStream]);

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
                stopWebcam();
            }
        }
    };

    const resetTakenImage = () => {
        setImageUrl(null);
        startWebcam();
    }

    useEffect(() => {
        startWebcam();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);
    
    return (
        <div className="flex flex-col md:flex-row w-full gap-5">
            <div className="md:flex-1 flex flex-col gap-2 text-white p-5 border border-dark-border rounded-lg">
                <h2 className="text-xl font-bold mb-2">Capturing a Good Photo</h2>
                <div>
                    <p className="text-lg font-semibold">Avoid Unnecessary Distractions</p>
                    <p>Ensure the frame includes only the receipt—remove any other items from view.</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Fitting the Receipt</p>
                    <p>Ensure the whole receipt is visible and within the frame.</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Ensure Good Lighting</p>
                    <p>Lighting should be balanced—not too bright or too dim—so all text on the receipt is clearly legible.</p>
                </div>
                <div>
                    <p className="text-lg font-semibold">Keep the Receipt Flat</p>
                    <p>Lay the receipt on a flat surface without folds or wrinkles to ensure all text is visible.</p>
                </div>
            </div>
            <div className="md:flex-[3]">
                { !imageUrl && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="border-2 border-dark-border rounded-lg"
                    />
                ) }

                { imageUrl && (
                    <img
                        alt="Captured Image"
                        src={decodeURIComponent(imageUrl)}
                        className="border-2 border-dark-border rounded-lg"
                    />
                ) }
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
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    )
}
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobilePhone } from "@/utils/isMobilePhone";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../ui/Toast";
import GlassContainer from "../ui/GlassContainer";

import { MdError } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { TiCameraOutline } from "react-icons/ti";
import PhotoTips from "../PhotoTips";

interface ICameraCapture {
    setImageUrl: (imageUrl: string | null) => void;
    imageUrl: string | null;
}

interface CameraError {
    isDisplayed: boolean;
    title: string;
    description: string;
}

export default function CameraCapture({ setImageUrl, imageUrl }: ICameraCapture) {    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<CameraError>({
        isDisplayed: false,
        title: "",
        description: ""
    });
    const [cameraPermissionState, setCameraPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
    const [ isHoveringCapturedImage, setIsHoveringCapturedImage ] = useState(false);

    const startWebcam = useCallback(async () => {
        try {
            setIsLoading(true);
            setError({ isDisplayed: false, title: "", description: "" });
            
            // Check if camera permissions are available
            if (navigator.permissions) {
                const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
                setCameraPermissionState(permission.state);
            }

            const constraints = isMobilePhone()
                ? { 
                    video: { 
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    } 
                }
                : { 
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    } 
                };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            
            setMediaStream(stream);
            setCameraPermissionState("granted");
            
            // Set video source after state updates to ensure video element is rendered
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (error) {
            console.error("Error accessing webcam", error);
            let errorMessage = "Failed to access camera. ";
            
            if (error instanceof Error) {
                if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                    errorMessage = "Camera permission denied. Please allow camera access and try again.";
                    setCameraPermissionState("denied");
                } else if (error.name === "NotFoundError" || error.name === "DeviceNotFoundError") {
                    errorMessage = "No camera found on this device.";
                } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
                    errorMessage = "Camera is already in use by another application.";
                } else if (error.name === "OverconstrainedError") {
                    errorMessage = "Camera does not support the requested settings.";
                }
            }
            
            setError({
                isDisplayed: true,
                title: "Camera Error",
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const stopWebcam = useCallback(() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, [mediaStream]);

    const captureImage = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            setIsLoading(true);
            
            const width = video.videoWidth;
            const height = video.videoHeight;
            
            if (width === 0 || height === 0) {
                setError({
                    isDisplayed: true,
                    title: "Capture Error",
                    description: "Unable to capture image. Please ensure the camera is working properly."
                });
                setIsLoading(false);
                return;
            }
            
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.filter = "contrast(1.1) brightness(1.05)";
                ctx.drawImage(video, 0, 0, width, height);
                
                try {
                    const imageData = canvas.toDataURL("image/jpeg", 0.95);
                    setImageUrl(imageData);
                    stopWebcam();
                } catch (error) {
                    console.error("Error creating image data", error);
                    setError({
                        isDisplayed: true,
                        title: "Capture Error",
                        description: "Failed to process the captured image. Please try again."
                    });
                }
            }
            setIsLoading(false);
        }
    }, [setImageUrl, stopWebcam]);

    const resetTakenImage = useCallback(() => {
        setImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        startWebcam();
    }, [setImageUrl, startWebcam]);

    const requestCameraPermission = useCallback(async () => {
        if (cameraPermissionState === "denied") {
            setError({
                isDisplayed: true,
                title: "Camera Permission Required",
                description: "Please enable camera permission in your browser settings and refresh the page."
            });
            return;
        }
        await startWebcam();
    }, [cameraPermissionState, startWebcam]);

    useEffect(() => {
        startWebcam();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [startWebcam, mediaStream])

    return (
        <div className="flex flex-col lg:flex-row w-full gap-5">
            <PhotoTips />
            
            <div className="lg:flex-[2] flex flex-col">
                <GlassContainer styles="relative overflow-hidden" isPadding={false}>
                    {/* Camera Permission Denied State */}
                    {cameraPermissionState === "denied" && !imageUrl && (
                        <div className="aspect-video flex flex-col items-center justify-center text-white p-8 text-center">
                            <MdError className="text-6xl mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
                            <p className="text-dark-secondary mb-4">Please enable camera permission in your browser settings and refresh the page.</p>
                            <button
                                onClick={requestCameraPermission}
                                className="px-6 py-2 bg-dark-accent hover:bg-accent rounded-lg duration-150"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && !imageUrl && (
                        <div className="aspect-video flex flex-col items-center justify-center text-white">
                            <FaSpinner className="text-4xl animate-spin text-dark-accent mb-4" />
                            <p>Loading camera...</p>
                        </div>
                    )}

                    {/* Video Stream */}
                    {!imageUrl && mediaStream && !isLoading && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full aspect-video object-cover"
                        />
                    )}

                    {/* Captured Image */}
                    {imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                            onTap={() => setIsHoveringCapturedImage(!isHoveringCapturedImage)}
                            onMouseEnter={() => setIsHoveringCapturedImage(true)}
                            onMouseLeave={() => setIsHoveringCapturedImage(false)}
                        >
                            <img
                                alt="Captured receipt"
                                src={decodeURIComponent(imageUrl)}
                                className="w-full aspect-video object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                Image Captured
                            </div>

                            {/* Hover Actions */}
                            <AnimatePresence mode="wait">
                                {isHoveringCapturedImage && (
                                    <motion.div
                                        className="absolute w-full h-full top-0 left-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                                    >
                                        <button
                                            className="text-dark-secondary hover:text-white hover:text-xl font-medium duration-150 px-4 py-2 rounded-lg cursor-pointer"
                                            onClick={resetTakenImage}
                                        >
                                            Retake Image
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </GlassContainer>

                {/* Action Buttons */}
                <GlassContainer styles="mt-6">
                    <div className="flex flex-row items-center justify-center gap-4">
                        {/* Capture/Loading Button */}
                        <button
                            className={`relative p-2 md:p-4 rounded-full cursor-pointer duration-200 ${
                                imageUrl || isLoading
                                    ? "bg-neutral-800 cursor-not-allowed" 
                                    : "bg-dark-accent hover:bg-accent shadow-lg shadow-dark-accent/25"
                            }`}
                            disabled={!!imageUrl || isLoading || !mediaStream}
                            onClick={captureImage}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0, rotate: -180 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 180 }}
                                    >
                                        <FaSpinner className="text-2xl text-white animate-spin" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="camera"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <TiCameraOutline className="text-3xl text-white" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                    
                    {/* Status Text */}
                    <div className="text-center mt-3">
                        {imageUrl ? (
                            <p className="text-green-400 text-sm">Receipt captured successfully. Press Continue to proceed.</p>
                        ) : mediaStream ? (
                            <p className="text-dark-secondary text-sm">Position your receipt and tap the camera button</p>
                        ) : (
                            <p className="text-dark-secondary text-sm">Starting camera...</p>
                        )}
                    </div>
                </GlassContainer>

                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {error.isDisplayed && (
                    <Toast
                        title={error.title}
                        description={error.description}
                        hideError={() => setError({ isDisplayed: false, title: "", description: "" })}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
"use client"
import { useRef, useState } from "react"

export default function ReceiptScanning() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);  

    return (
        <div className="bg-dark-background min-h-screen flex flex-col items-center justify-center">
            <div className="camera">
                <video id="video"></video>
            </div>
        </div>
    )
}
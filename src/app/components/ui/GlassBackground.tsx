import Image from "next/image";

export default function GlassBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Image
                src="/background.svg"
                alt="Background"
                fill
                className="object-cover"
                priority
            />
        </div>
    )
}
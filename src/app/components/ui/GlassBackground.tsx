export default function GlassBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <img
                src="/background.svg"
                alt="Background"
                className="object-cover w-full h-full"
                style={{ filter: "blur(80px)" }}
            />
        </div>
    )
}
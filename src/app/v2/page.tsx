import GlassBackground from "../components/ui/GlassBackground";

export default function Home() {
    return (
        <div className="relative min-h-screen min-w-screen bg-dark-background text-white">
            <GlassBackground />
            <div className="absolute w-full h-full flex items-center justify-center text-center z-20">
                {/* Header */}
                <header className="flex flex-col gap-4">
                    <h1 className="font-bold text-6xl">PayMeLah!</h1>
                    <p className="italic text-2xl font-medium text-dark-secondary">Split shared expenses with your friends, easily.</p>
                    <button className="bg-white text-dark-background font-bold px-6 py-2 rounded-lg">
                        Get Started
                    </button>
                </header>
            </div>
        </div>
    )
}
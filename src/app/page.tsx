import GlassTermsAndPrivacy from "@/app/components/GlassTermsAndPrivacy";
import GlassBackground from "@/app/components/ui/GlassBackground";
import GlassContainer from "@/app/components/ui/GlassContainer";
import ScanReceiptButton from "@/app/components/ui/ScanReceiptButton";

export default function Home() {
    return (
        <div className="relative min-h-screen min-w-screen bg-dark-background text-white">
            <GlassBackground />
            <div className="absolute w-full h-full flex flex-col items-center justify-start md:justify-center text-center z-20 p-3 py-15 sm:p-10 md:p-24 lg:p-32 xl:p-64">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="font-bold text-5xl md:text-6xl">PayMeLah!</h1>
                    <p className="italic text-lg md:text-2xl font-medium text-dark-secondary mt-3 mb-6">Split shared expenses with your friends, easily.</p>
                    <ScanReceiptButton />
                </header>

                <div>
                    {/* Steps Container */}
                    <div className="flex flex-col md:flex-row gap-5 mb-10">
                        <GlassContainer styles="flex-1 text-left md:text-center">
                            <p className="font-bold text-5xl mb-2">1</p>
                            <h2 className="font-bold text-xl">Scan Receipts Instantly</h2>
                            <p className="font-medium text-dark-secondary">Use your camera to scan any receipt, restaurant, grocery, or group expense. Receipt Items are instantly itemised.</p>
                        </GlassContainer>

                        <GlassContainer styles="flex-1 text-left md:text-center">
                            <p className="font-bold text-5xl mb-2">2</p>
                            <h2 className="font-bold text-xl">Split Bills, The Smart Way</h2>
                            <p className="font-medium text-dark-secondary">Easily split the receipt among friends or group members. Assign individual items, divide shared costs, or split evenly</p>
                        </GlassContainer>

                        <GlassContainer styles="flex-1 text-left md:text-center">
                            <p className="font-bold text-5xl mb-2">3</p>
                            <h2 className="font-bold text-xl">Share the Total</h2>
                            <p className="font-medium text-dark-secondary">Share the bill with your group in just a tap. Send the link via text, email, or through the app.</p>
                        </GlassContainer>
                    </div>

                    {/* Privacy Matters */}
                    <GlassContainer styles="flex flex-col md:flex-row gap-5 md:gap-10 w-full text-left md:items-center p-5 md:p-10">
                        <div className="md:max-w-sm md:mr-auto">
                            <p className="text-sm font-semibold text-dark-accent">Our promise</p>
                            <h2 className="text-3xl md:text-4xl font-bold mb-1">Your Privacy, Assured</h2>
                            <p className="text-dark-secondary">Easily split the receipt among friends or group members. Assign individual items, divide shared costs, or split evenly.</p>
                        </div>

                        <GlassTermsAndPrivacy />
                    </GlassContainer>
                </div>

                <p className="mt-5 text-dark-secondary italic font-medium text-sm pb-10">Developed with ♥ by Ethan Chew</p>
            </div>
        </div>
    )
}
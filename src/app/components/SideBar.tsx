import { PayMeLahSteps } from "./ProgressBar/data";
import VerticalProgressBar from "./ProgressBar/VerticalProgressBar";

export default function SideBar({ currentStep = PayMeLahSteps.Scan }: { currentStep?: PayMeLahSteps }) {
    return (
        <>
            <nav className="fixed top-0 left-0 p-6 py-10 bg-neutral-800 h-screen hidden sm:w-1/4 lg:w-1/5 sm:flex flex-col justify-between text-white z-50">
                <div>
                    <p className="text-3xl font-bold mb-1">PayMeLah!</p>
                    <p className="text-dark-secondary">Split shared expenses with your friends, easily.</p>
                </div>

                <VerticalProgressBar currentStep={currentStep} />
            </nav>
            <nav className="block w-full sm:hidden py-3 px-5 text-white bg-neutral-800">
                <p className="text-xl font-bold">PayMeLah</p>
            </nav>
        </>
    )
}
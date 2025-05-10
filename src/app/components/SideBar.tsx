import { PayMeLahSteps } from "./ui/ProgressBar/data";
import VerticalProgressBar from "./ui/ProgressBar/VerticalProgressBar";

export default function SideBar() {
    return (
        <nav className="fixed top-0 left-0 p-6 py-10 bg-neutral-800 h-screen md:w-1/4 lg:w-1/5 hidden sm:flex flex-col justify-between text-white z-50">
            <div>
                <p className="text-3xl font-bold mb-1">PayMeLah!</p>
                <p className="text-dark-secondary">Split shared expenses with your friends, easily.</p>
            </div>

            <VerticalProgressBar currentStep={PayMeLahSteps.Split} />
        </nav>
    )
}
import { PayMeLahSteps, steps } from "@/app/components/ProgressBar/data";

export default function DesktopProgressBar({ currentStep }: { currentStep: PayMeLahSteps }) {
    return (
        <div className="hidden lg:flex flex-col w-full">
            { Object.values(steps).map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <div key={index} className={`flex flex-row items-center gap-3 border-l-2 ${
                        isCompleted || isActive ? "border-dark-accent" : "border-dark-secondary"
                    } pl-4`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted ? "bg-dark-accent border-dark-accent" : isActive ? "border-dark-accent bg-white/5" : "border-white/20 bg-white/5 backdrop-blur-lg"}`}>
                            { step.icon }
                        </div>
                        <p className={`text-lg font-semibold py-3 ${isCompleted || isActive ? "text-dark-accent" : "text-dark-secondary"}`}>{ step.title }</p>
                    </div>
                )
            }) }
        </div>
    )
}
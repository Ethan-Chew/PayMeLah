import { PayMeLahSteps, steps } from "./data";

export default function VerticalProgressBar({ currentStep }: { currentStep: PayMeLahSteps }) {
    const stepEntries = Object.values(steps);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-0">
                {stepEntries.map((step, index) => (
                    <div key={index} className={`flex flex-row items-center gap-3 border-l-2 ${index <= currentStep ? "border-dark-accent" : "border-dark-secondary"} pl-4`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-dark-accent" : "bg-gray-300"}`}>
                            { step.icon }
                        </div>
                        <p className="text-lg font-semibold py-3">{ step.title }</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Fragment } from "react"
import { PayMeLahSteps, steps } from "@/app/components/ProgressBar/data";

export default function MobileProgressBar({ currentStep }: { currentStep: PayMeLahSteps }) {
    return (
        <div className="flex lg:hidden flex-row w-full">
            { Object.values(steps).map((step, index) => {
                const isCompleted = index  < currentStep;
                const isActive = index === currentStep;

                return (
                    <Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted ? "border-dark-accent bg-dark-accent" : isActive ? "border-dark-accent bg-white/5 backdrop-blur-lg" : "border-white/20 bg-white/5 backdrop-blur-lg"}`}>
                                { step.icon }
                            </div>
                            <p className={`mt-1 text-center ${isCompleted || isActive ? "text-dark-accent font-semibold" : "text-white/60"}`}>
                                { step.title }
                            </p>
                        </div>
                        { index < Object.values(steps).length - 1 && (
                            <div className={`flex-1 h-1 ${isCompleted ? "bg-dark-accent" : "bg-white/20"} mt-5`}></div>
                        ) }
                    </Fragment>
                )
            }) }
        </div>
    )
}
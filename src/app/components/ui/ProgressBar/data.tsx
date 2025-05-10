import { ReactNode } from "react";
import { MdDocumentScanner, MdFormatListBulleted, MdIosShare } from "react-icons/md";

interface StepInfo {
    title: string;
    description: string;
    icon: ReactNode; // ReactNode is the correct type for React elements
}

export enum PayMeLahSteps {
    Scan = 0,
    Split = 1,
    Share = 2,
}

export const steps: Record<PayMeLahSteps, StepInfo> = {
    [PayMeLahSteps.Scan]: {
        title: "Scan",
        description: "Upload or take a picture of the receipt.",
        icon: <MdDocumentScanner className="w-4 h-4 text-white" />,
    },
    [PayMeLahSteps.Split]: {
        title: "Split",
        description: "Assign items to each friend.",
        icon: <MdFormatListBulleted className="w-4 h-4 text-white" />,
    },
    [PayMeLahSteps.Share]: {
        title: "Share",
        description: "Send payment links to your friends.",
        icon: <MdIosShare className="w-4 h-4 text-white" />,
    },
};
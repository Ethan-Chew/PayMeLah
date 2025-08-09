import { ReactNode, HTMLAttributes } from "react";

interface GlassContainerProps {
    children: ReactNode;
    styles?: string;
}

export default function GlassContainer({ children, styles }: GlassContainerProps) {
    return (
        <div
            className={`${styles} bg-white/5 backdrop-blur-lg rounded-lg p-4 shadow-sm border-2 border-white/20`}
        >
            {children}
        </div>
    );
}
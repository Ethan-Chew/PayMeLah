import { ReactNode } from "react";

interface GlassContainerProps {
    children: ReactNode;
    isPadding?: boolean;
    styles?: string;
}

export default function GlassContainer({ children, styles, isPadding=true }: GlassContainerProps) {
    return (
        <div
            className={`${styles} bg-white/3 backdrop-blur-lg rounded-lg ${isPadding ? 'p-4' : 'p-0'} shadow-sm border-2 border-white/20`}
        >
            {children}
        </div>
    );
}
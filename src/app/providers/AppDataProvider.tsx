import { createContext, ReactNode, useContext, useState } from "react";

interface IAppDataContext {
    imageUrl: string | null;
    setImageUrl: (url: string | null) => void;
    savedReceiptId: string | null;
    setSavedReceiptId: (id: string | null) => void;
}

const AppDataContext = createContext<IAppDataContext | null>(null);

export const AppDataProvider = ({ children } : { children: ReactNode }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [savedReceiptId, setSavedReceiptId] = useState<string | null>(null);

    return (
        <AppDataContext.Provider value={{ imageUrl, setImageUrl, savedReceiptId, setSavedReceiptId }}>
            {children}
        </AppDataContext.Provider>
    )
}

export const useAppData = (): IAppDataContext => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error("useAppData must be used within AppDataProvider");
    }
    return context;
}
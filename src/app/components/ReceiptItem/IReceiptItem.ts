import { ReceiptItem } from "@/db/types";

export interface IReceiptItem {
    item: ReceiptItem,
    people: string[],
    addItemShare: (itemName: string, userName: string, share: number) => void,
    clearItemShares: (itemName: string) => void,
    removeItemShare?: (itemName: string, userName: string) => void,
}
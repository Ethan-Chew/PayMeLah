import { ReceiptItem } from "@/db/types";

export interface IReceiptItem {
    item: ReceiptItem,
    people: string[],
    addReceiptItemShare: (itemName: string, userName: string, share: number) => void,
    clearItemShares: (itemName: string) => void,
}
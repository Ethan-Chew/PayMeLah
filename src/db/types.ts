type CreateReceiptModal = {
    title: string,
    date: string,
    payee: string,
    others: string[],
    saveGroup: boolean
}

type ReceiptItem = {
    name: string,
    quantity: number,
    unitCost: number,
}

type ParsedReceipt = {
    items: ReceiptItem[],
    gst: number,
    serviceCharge: number,
}

export type { CreateReceiptModal, ReceiptItem, ParsedReceipt };
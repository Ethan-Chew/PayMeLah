type ReceiptDetails = {
    title: string,
    date: string,
    members: string[],
}

type ReceiptItem = {
    name: string,
    quantity: number,
    unitCost: number,
    shares: ReceiptItemShare[]
}

type ReceiptItemShare = {
    userName: string,
    share: number
}

type ParsedReceipt = {
    items: ReceiptItem[],
    gst: number,
    serviceCharge: number,
}

type DisplayedReceipt = ReceiptDetails & ParsedReceipt

export type { ReceiptDetails, ReceiptItem, ReceiptItemShare, ParsedReceipt, DisplayedReceipt };
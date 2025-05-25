import { ReceiptItem } from "@/db/types";

export default function PersonSummaryItem({ name, receiptItems }: { name: string, receiptItems: ReceiptItem[] }) {
    const totalAmount = receiptItems.reduce((accumulator, item) => {
        const userShare = item.shares.find((share) => share.userName === name);
        if (!userShare || !userShare.share) return accumulator;
        return accumulator + (item.unitCost * userShare.share);
    }, 0)

    return (
        <div className="p-3 border border-dark-border rounded-lg text-white flex flex-col">
            <div className="inline-flex place-content-between items-center mb-2">
                <div className="inline-flex flex-row gap-3">
                    <p className="h-8 w-8 bg-dark-accent rounded-full flex items-center justify-center font-semibold">{ name[0].toUpperCase() }</p>
                    <p className="text-lg font-semibold">{ name }</p>
                </div>
                <p className="text-xl text-dark-accent font-bold">${totalAmount.toFixed(2)}</p>
            </div>

            <div className="text-dark-secondary w-full">
                { receiptItems.map((item, index) => {
                    const userShare = item.shares.find((share) => share.userName === name);
                    if (!userShare || !userShare.share) return null;
                    return (
                        <div key={index} className="inline-flex place-content-between py-2 w-full">
                            <p>{ item.name } ({ userShare.share.toFixed(2) }x)</p>
                            <p>${ (item.unitCost * userShare.share).toFixed(2) }</p>
                        </div>
                    )
                }) }
            </div>
        </div>
    )
}
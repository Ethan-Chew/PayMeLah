import { ReceiptItem } from "@/db/types";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { motion } from "motion/react";
import { FiEdit3 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";

export default function UpdateReceiptItems({ receiptItems, hideModal }: { receiptItems: ReceiptItem[], hideModal: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 top-0 left-0 w-screen h-screen bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
            <div className="z-[60] relative bg-dark-background border border-dark-border text-white sm:rounded-lg shadow-lg w-full h-full sm:w-auto sm:h-auto sm:m-10">
                <div className="text-2xl font-semibold px-5 py-4 border-b border-dark-border flex items-center justify-between">
                    <h2>Edit Receipt Items</h2>
                    <FaXmark className="cursor-pointer" onClick={hideModal} />
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                    { receiptItems.length > 0 ? (
                        receiptItems.map((item, index) => (
                            <ReceiptItemRow key={index} item={item} />
                        ))
                    ) : (
                        <p className="text-center text-dark-secondary">No items to display.</p>
                    )}

                    <button className="p-3 bg-dark-accent hover:bg-accent text-dark-background rounded-md font-semibold flex items-center justify-center gap-2 w-full sm:w-auto">
                        <FaPlus />
                        <p>Add Item</p>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function ReceiptItemRow({ item }: { item: ReceiptItem }) {
    return (
        <div className="px-3 py-2 border border-dark-border bg-dark-container rounded-lg">
            <p className="text-xl font-semibold mb-1">{ item.name }</p>
            <div className="flex flex-row place-content-between gap-3">
                <p><span className="font-semibold">Quantity: </span>{ item.quantity }</p>
                <p><span className="font-semibold">Unit Cost: </span>{ item.unitCost }</p>
            </div>
            <div className="inline-flex flex-row gap-3">
                <button className="inline-flex flex-row gap-2 items-center">
                    <FiEdit3 />
                    <p>Edit</p>
                </button>
                <button className="inline-flex flex-row gap-2 items-center">
                    <FaRegTrashCan className="text-red-500" />
                    <p className="text-red-500">Delete</p>
                </button>
            </div>
        </div>
    )
}
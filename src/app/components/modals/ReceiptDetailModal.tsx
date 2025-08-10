"use client"
import NameInput from "../ui/NameInput";
import { ReceiptDetails } from "@/db/types";

interface IReceiptDetailModal {
    receiptDetails: ReceiptDetails,
    setReceiptDetails: (val: ReceiptDetails) => void,
    setShowUpdateItemsModal: () => void,
}

export default function ReceiptDetailModal({ receiptDetails, setReceiptDetails, setShowUpdateItemsModal }: IReceiptDetailModal) {
    const addName = (name: string) => {
        if (name && !receiptDetails.members.includes(name)) {
            setReceiptDetails({ ...receiptDetails, members: [...receiptDetails.members, name] });
        }
    };
    
    const removeName = (name: string) => {
        setReceiptDetails({
            ...receiptDetails,
            members: receiptDetails.members.filter((n) => n !== name)
        });
    };

    return (
        <form className="flex flex-col gap-4 w-full text-white">
            <div className="w-full flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Receipt Title</p>
                    <input
                        className="px-4 py-2 border border-dark-border w-full focus:outline-none"
                        placeholder="The Amazing Restaurant"
                        value={receiptDetails.title}
                        onChange={(e) => setReceiptDetails({ ...receiptDetails, title: e.target.value })}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Restaurant/Store&apos;s Name</p>
                </div>

                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Date of Receipt</p>
                    <input
                        className="px-4 py-2 border border-dark-border text-white w-full focus:outline-none"
                        type="date"
                        value={receiptDetails.date}
                        onChange={(e) => setReceiptDetails({ ...receiptDetails, date: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Others with you</p>
                    <NameInput
                        names={receiptDetails.members}
                        addName={addName}
                        removeName={removeName}
                    />
                    <p className="text-dark-secondary text-sm mt-1">Others who are supposed to pay (press enter to enter a new name!)</p>
                </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold">Items don&apost look right?</p>
                    <p className="text-dark-secondary text-sm">PayMeLah! uses AI Technologies to retrieve receipt items, hence, there might be some discrepancies. You may update receipt items if needed.</p>
                </div>
                <button
                    className="p-3 bg-dark-accent hover:bg-accent text-dark-background rounded-md font-semibold"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowUpdateItemsModal();
                    }}
                >
                    Update Items
                </button>
            </div>

            {/* <div className="w-full inline-flex items-center justify-start gap-3">
                <input 
                    type="checkbox"
                    className="h-5 w-5"
                    checked={formData.saveGroup}
                    onChange={(e) => setFormData({ ...formData, saveGroup: e.target.checked })}
                />
                <div>
                    <p className="text-lg font-semibold">Save this Group?</p>
                    <p className="text-dark-secondary text-sm">If you're logged in on the same device or into your account, you'll be able to reuse this group.</p>
                </div>
            </div> */}
        </form>
   )
}
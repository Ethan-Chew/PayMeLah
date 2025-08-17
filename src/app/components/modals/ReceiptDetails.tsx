"use client"
import NameInput from "../ui/NameInput"
import { ReceiptDetails } from "@/db/types"

interface IReceiptDetails {
    details: ReceiptDetails,
    setDetails: (val: ReceiptDetails) => void,
    setShowReceiptItemsModal: (vol: boolean) => void
}

export default function ReceiptDetailsModal({ details, setDetails, setShowReceiptItemsModal }: IReceiptDetails) {
    const addName = (name: string) => {
        if (name && !details.members.includes(name)) {
            setDetails({ ...details, members: [...details.members, name] });
        }
    };
    
    const removeName = (name: string) => {
        setDetails({
            ...details,
            members: details.members.filter((n) => n !== name)
        });
    };

    return (
        <div className="space-y-3 w-full text-white">
            <div className="w-full flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Receipt Title</p>
                    <input
                        className="px-4 py-2 border-2 border-white/30 w-full focus:outline-none rounded-lg"
                        placeholder="The Amazing Restaurant"
                        value={details.title}
                        onChange={(e) => setDetails({ ...details, title: e.target.value })}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Restaurant/Store&apos;s Name</p>
                </div>

                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Date of Receipt</p>
                    <input
                        className="px-4 py-2 border-2 border-white/30 w-full focus:outline-none rounded-lg"
                        type="date"
                        value={details.date}
                        onChange={(e) => setDetails({ ...details, date: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="flex-1">
                <p className="text-lg font-semibold mb-2">People Involved</p>
                <NameInput
                    names={details.members}
                    addName={addName}
                    removeName={removeName}
                />
                <p className="text-dark-secondary text-sm mt-1">Everyone who was involved (press enter to enter a new name!)</p>
            </div>

            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold">Items don&apos;t look right?</p>
                    <p className="text-dark-secondary text-sm">PayMeLah! uses AI Technologies to retrieve receipt items, hence, there might be some discrepancies. You may update receipt items if needed.</p>
                </div>
                <button
                    className="p-3 bg-dark-accent hover:bg-accent text-white rounded-md font-semibold transition-all duration-150 cursor-pointer"
                    onClick={() => setShowReceiptItemsModal(true)}
                >
                    Update Items
                </button>
            </div>
        </div>
    )
}
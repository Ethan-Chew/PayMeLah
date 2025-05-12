"use client"
import NameInput from "../ui/NameInput";
import { FaArrowRight } from "react-icons/fa6";
import { CreateReceiptModal } from "@/db/types";
import { FormEvent } from "react";

interface IReceiptDetailModal {
    formData: CreateReceiptModal,
    setFormData: (val: CreateReceiptModal) => void
}

export default function ReceiptDetailModal({ formData, setFormData}: IReceiptDetailModal) {
    const addName = (name: string) => {
        if (name && !formData.others.includes(name)) {
            setFormData({ ...formData, others: [...formData.others, name] });
        }
    };
    
    const removeName = (name: string) => {
        setFormData({
            ...formData,
            others: formData.others.filter((n) => n !== name)
        });
    };

    return (
        <form className="flex flex-col gap-4 w-full text-white">
            <div className="w-full flex flex-row gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Receipt Title</p>
                    <input
                        className="px-4 py-2 border border-dark-border w-full focus:outline-none"
                        placeholder="The Amazing Restaurant"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Restaurant/Store's Name</p>
                </div>

                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Date of Receipt</p>
                    <input
                        className="px-4 py-2 border border-dark-border text-white w-full focus:outline-none"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Who Paid?</p>
                    <input
                        className="px-4 py-2 border border-dark-border w-full focus:outline-none"
                        placeholder=""
                        value={formData.payee}
                        onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                        required
                    />
                    <p className="text-dark-secondary text-sm mt-1">The Name of the Person who Paid</p>
                </div>

                <div className="flex-1">
                    <p className="text-lg font-semibold mb-2">Others with you</p>
                    <NameInput
                        names={formData.others}
                        addName={addName}
                        removeName={removeName}
                    />
                    <p className="text-dark-secondary text-sm mt-1">Others who are supposed to pay (press enter to enter a new name!)</p>
                </div>
            </div>


            <div className="w-full inline-flex items-center justify-start gap-3">
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
            </div>
        </form>
   )
}
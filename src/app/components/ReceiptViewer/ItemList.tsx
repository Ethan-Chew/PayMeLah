"use client";
import { useState } from "react";
import TabBar from "./TabBar";

export default function ItemList({ items, members }: { items: any[], members: string[] }) {
    const [selectedOption, setSelectedOption] = useState("All Items");
    
    return (
        <div>
            <TabBar
                options={["All Items", ...members]}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />

            <div className="mt-4 flex flex-col">
                {items.filter((item) => (
                    item.shares.some((share: any) => share.userName === selectedOption) || selectedOption === "All Items"
                )).map((item, index) => (
                    <Item key={index} item={item} />
                ))}
            </div>
        </div>
    )
}

export function Item({ item }: { item: any }) {
    return (
        <div className="p-4 border-b border-dark-border">
            <p className="text-lg font-bold">{ item.name }{ item.quantity > 1 && ` (${item.quantity}x)` }</p>
            <p className="mb-2">${ item.unitCost * item.quantity }{ item.quantity > 1 && ` ($${parseFloat(item.unitCost).toFixed(2)} each)` }</p>
            <div className="inline-flex flex-row gap-2">
                { item.shares.map((share: any, index: number) => (
                    <div key={index} className="px-2 py-1 border border-dark-border rounded-lg">
                        <p>{ share.userName } ({Number.isInteger(+share.share) ? `${parseInt(share.share)}` : (+share.share).toFixed(2)}x)</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
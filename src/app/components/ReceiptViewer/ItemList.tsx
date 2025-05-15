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

            <div className="mt-4 flex flex-row gap-2">
                {items.map((item, index) => (
                    <Item key={index} item={item} />
                ))}
            </div>
        </div>
    )
}

export function Item({ item }: { item: any }) {
    return (
        <div className="px-4 py-2 border border-dark-border rounded-lg">
            { item.name }
        </div>
    )
}
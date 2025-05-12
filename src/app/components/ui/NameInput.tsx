import { useState } from "react";
import { FaXmark } from "react-icons/fa6"

interface INameInput {
    names: string[],
    addName: (name: string) => void;
    removeName: (name: string) => void;
}

export default function NameInput({ names, addName, removeName }: INameInput) {
    const [userInput, setUserInput] = useState("");

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            addName(userInput);
            setUserInput("");
        } else if (e.key === "Backspace" && userInput === "") {
            e.preventDefault();

            if (names.length > 0) {
                removeName(names[names.length - 1])
            }
        }
    }

    return (
        <div className="max-w-full flex flex-row gap-2 px-4 py-2 border border-dark-border overflow-x-auto whitespace-nowrap">
            { names.map((name, index) => ( <NameTag key={index} name={name} removeName={removeName} /> ))}
            <input 
                className="w-auto shrink-0 focus:outline-none"
                onKeyDown={handleKeyPress}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
        </div>
    )
}

function NameTag({ name, removeName }: { name: string, removeName: (name: string) => void }) {
    return (
        <div className="shrink-0 inline-flex gap-2 items-center bg-dark-border hover:bg-neutral-800 duration-150 px-2 py-0.5">
            <p>{ name }</p>
            <FaXmark
                className="cursor-pointer"
                onClick={() => removeName(name)}
            />
        </div>
    )
}
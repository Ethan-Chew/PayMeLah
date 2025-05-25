import { FaRegFileLines } from "react-icons/fa6";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function TermsAndPrivacy() {
    return (
        <>
            <div className="bg-dark-background p-4 rounded-lg border-2 border-dark-border flex-1 flex flex-row md:flex-col gap-5 md:gap-2 items-center md:items-start">
                <FaRegFileLines className="text-4xl flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold">Terms and Conditions</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>
            </div>

            <div className="bg-dark-background p-4 rounded-lg border-2 border-dark-border flex-1 flex flex-row md:flex-col gap-5 md:gap-2 items-center md:items-start">
                <MdOutlinePrivacyTip className="text-4xl flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold">Privacy Policy</p>
                    <p>Our commitment to keeping your data secure.</p>
                </div>
            </div>
        </>
    )
}
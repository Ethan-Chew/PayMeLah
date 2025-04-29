import { FaRegFileLines } from "react-icons/fa6";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function TermsAndPrivacy() {
    return (
        <div className="p-4 bg-dark-container rounded-lg">
            <h2 className="text-2xl font-bold">Terms & Privacy</h2>
            <p className="text-dark-secondary mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>

            <div className="flex flex-col md:flex-row gap-5">
                <div className="bg-dark-background p-4 rounded-lg flex-1 flex flex-row md:flex-col gap-5 md:gap-2 items-center md:items-start">
                    <FaRegFileLines className="text-4xl" />
                    <div>
                        <p className="text-lg md:text-xl font-bold">Terms and Conditions</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                    </div>
                </div>

                <div className="bg-dark-background p-4 rounded-lg flex-1 flex flex-row md:flex-col gap-5 md:gap-2 items-center md:items-start">
                    <MdOutlinePrivacyTip className="text-4xl" />
                    <div>
                        <p className="text-lg md:text-xl font-bold">Privacy Policy</p>
                        <p>Our commitment to keeping your data secure.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
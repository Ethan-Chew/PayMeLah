import { FaRegFileLines } from "react-icons/fa6";
import { MdOutlinePrivacyTip } from "react-icons/md";
import GlassContainer from "./ui/GlassContainer";

export default function GlassTermsAndPrivacy() {
    return (
        <>
            <GlassContainer styles="bg-white/2">
                <FaRegFileLines className="text-4xl flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold">Terms and Conditions</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                </div>
            </GlassContainer>

            <GlassContainer styles="bg-white/2">
                <MdOutlinePrivacyTip className="text-4xl flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-lg md:text-xl font-bold">Privacy Policy</p>
                    <p>Our commitment to keeping your data secure.</p>
                </div>
            </GlassContainer>
        </>
    )
}
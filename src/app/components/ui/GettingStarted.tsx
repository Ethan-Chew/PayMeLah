import { FaArrowRightLong } from "react-icons/fa6";
import { MdDocumentScanner, MdFormatListBulleted, MdIosShare } from "react-icons/md";

export default function GettingStarted() {
    return (
        <div className="p-6 bg-dark-container rounded-lg">
            <h2 className="text-3xl font-semibold">Getting Started</h2>
            <p className="mb-5 text-dark-secondary">Getting started with PayMeLah! is as easy three main steps.</p>
            <div className="flex flex-row place-content-between items-center gap-2 md:gap-10">
                
                <div className="flex-1 bg-dark-background p-2 px-4 rounded-lg">
                    <div className="inline-flex flex-row items-center gap-3 text-md md:text-xl font-semibold">
                        <MdDocumentScanner className="text-xl md:text-2xl" />
                        <p>Scan</p>
                    </div>
                    <p className="text-dark-secondary">Upload or take a picture of the receipt.</p>
                </div>
                <FaArrowRightLong className="text-xl md:text-2xl" />
                <div className="flex-1 bg-dark-background p-2 px-4 rounded-lg items-center">
                    <div className="inline-flex flex-row items-center gap-3 text-md md:text-xl font-semibold">
                        <MdFormatListBulleted className="text-xl md:text-2xl" />
                        <p>Split</p>
                    </div>
                    <p className="text-dark-secondary">Assign items to each friend.</p>
                </div>
                <FaArrowRightLong className="text-xl md:text-2xl" />
                <div className="flex-1 bg-dark-background p-2 px-4 rounded-lg items-center">
                    <div className="inline-flex flex-row items-center gap-3 text-md md:text-xl font-semibold">
                        <MdIosShare className="text-xl md:text-2xl" />
                        <p>Share</p>
                    </div>
                    <p className="text-dark-secondary">Send payment links to your friends.</p>
                </div>
            </div>
        </div>
    )
}
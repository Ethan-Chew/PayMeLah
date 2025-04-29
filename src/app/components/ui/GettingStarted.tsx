import { FaArrowRightLong } from "react-icons/fa6";
import { MdDocumentScanner, MdFormatListBulleted, MdIosShare } from "react-icons/md";

export default function GettingStarted() {
    return (
        <div className="p-4 bg-dark-container rounded-lg">
            <h2 className="text-2xl font-bold">Getting Started</h2>
            <p className="mb-3 text-dark-secondary">Getting started with PayMeLah! is as easy three main steps.</p>
            <div className="flex flex-row place-content-between items-center gap-2 md:gap-10 text-md md:text-xl">
                <div className="inline-flex flex-row gap-3 flex-grow bg-dark-background p-2 px-4 rounded-lg items-center">
                    <MdDocumentScanner className="text-xl md:text-2xl" />
                    <p>Scan</p>
                </div>
                <FaArrowRightLong className="text-xl md:text-2xl" />
                <div className="inline-flex flex-row gap-3 flex-grow bg-dark-background p-2 px-4 rounded-lg items-center">
                    <MdFormatListBulleted className="text-xl md:text-2xl" />
                    <p>Split</p>
                </div>
                <FaArrowRightLong className="text-xl md:text-2xl" />
                <div className="inline-flex flex-row gap-3 flex-grow bg-dark-background p-2 px-4 rounded-lg items-center">
                    <MdIosShare className="text-xl md:text-2xl" />
                    <p>Share</p>
                </div>
            </div>
        </div>
    )
}
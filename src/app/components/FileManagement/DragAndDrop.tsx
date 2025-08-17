import { MdOutlineFileUpload } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import { ChangeEvent, DragEvent, useState } from "react";
import Toast from "../ui/Toast";
import { FaXmark } from "react-icons/fa6";

interface IDragAndDrop {
    setImageUrl: (imageUrl: string | null) => void;
    imageUrl: string | null;
}

export default function DragAndDrop({ setImageUrl, imageUrl }: IDragAndDrop) {
    const [ isDragging, setIsDragging ] = useState(false);
    const [ uploadedFile, setUploadedFile ] = useState<File | null>(null);
    const [ error, setError ] = useState({
        isDisplayed: false,
        title: "",
        description: ""
    });

    const saveToBase64 = (file: File) => {
        const reader = new FileReader();
      
        reader.onloadend = () => {
            const base64String = reader.result;
            if (typeof base64String === 'string') {
                setImageUrl(base64String);
            }
        };

        reader.readAsDataURL(file);
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        setUploadedFile(file);
        saveToBase64(file);
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadedFile(file);
        saveToBase64(file);
    }

    function formatFileSize(bytes: number): string {
        const kb = 1024;
        const mb = kb * 1024;

        if (bytes < kb) return `${bytes} B`;
        if (bytes < mb) return `${(bytes / kb).toFixed(1)} KB`;
        return `${(bytes / mb).toFixed(2)} MB`;
    }

    return (
        <>
            <div
                className={`
                    w-full flex flex-col gap-2 items-center justify-center text-white border-2 border-lg border-dashed rounded-lg border-white/50 hover:border-white p-5 md:p-10 px-10 md:px-20 duration-150
                    ${isDragging ? "bg-neutral-800" : ""}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
            >
                { uploadedFile && imageUrl ? (
                    <>
                        <p className="text-dark-secondary">File Uploaded! Drag and Drop to upload a new file.</p>
                        <div className="flex-1 inline-flex flex-row gap-2 items-center justify-center">
                            <img
                                alt="Captured receipt"
                                src={decodeURIComponent(imageUrl)}
                                className="h-14 w-15 object-cover rounded-lg border-2 border-white/20"
                            />
                            <div>
                                <div className="inline-flex flex-row gap-10 items-center">
                                    <p className="font-semibold mb-1">{uploadedFile.name}</p>
                                    <FaXmark
                                        className="cursor-pointer"
                                        onClick={() => setUploadedFile(null)}
                                    />
                                </div>
                                <p>{ formatFileSize(uploadedFile.size) }</p>
                            </div>
                        </div>
                    </>
                ) : (
                    isDragging ? (
                        <p>Drop your file to upload it!</p>
                    ) : (
                        <>
                            <IoCameraOutline className="text-5xl text-dark-secondary" />
                            <div className="text-center">
                                <p className="text-xl font-semibold mb-1">Upload your Receipt</p>
                                <p className="text-dark-secondary">Supports JPG and PNG files</p>
                            </div>
                            <label htmlFor="fileUpload" className="cursor-pointer">
                                <div className="text-lg px-6 py-2 inline-flex flex-row items-center gap-2 text-white bg-dark-accent rounded-lg">
                                    <MdOutlineFileUpload className="text-xl" />
                                    <p>Upload</p>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    multiple={false}
                                    className="hidden"
                                    id="fileUpload"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </>
                    )
                ) }

                { error.isDisplayed && (
                    <Toast
                        title="Receipt Processed"
                        description="Your receipt has been processed successfully. You can now split the costs with your friends."
                        hideError = {() => setError({ ...error, isDisplayed: false })}
                    />
                ) }
            </div>
        </>
    )
}
import GlassContainer from "@/app/components/ui/GlassContainer";

export default function PersonItemList({ name, items, memberGstServiceCharge }: { name: string, items: any[], memberGstServiceCharge: any }) {
    return (
        <GlassContainer>
            <div className="flex flex-row items-center justify-between mb-4 text-white font-semibold">
                <div className="inline-flex flex-row items-center justify-center gap-2">
                    <p className="h-6 w-6 flex items-center justify-center bg-dark-accent rounded-full">{ name[0].toUpperCase() }</p>
                    <p>{ name }</p>
                </div>
                <p className="text-xl">${ memberGstServiceCharge[name].total.toFixed(2) }</p>
            </div>

            <div className="flex flex-col gap-2">
                { items
                    .filter(item => item.shares.some((share: any) => share.userName === name))
                    .map((item, index) => {
                        const userShare = item.shares.find((share: any) => share.userName === name);

                        return (
                            <div key={index} className="flex flex-row place-content-between items-center">
                                <p>{ item.name } ({ parseFloat(userShare.share).toFixed(2) }x)</p>
                                <p>${ (item.unitCost * userShare.share).toFixed(2) }</p>
                            </div>
                        )
                    }
                ) }

                <p className="my-2 border-b border-white/20"></p>

                <div className="flex flex-row place-content-between items-center">
                    <p>GST (9%)</p>
                    <p>${ memberGstServiceCharge[name].gst.toFixed(2) }</p>
                </div>
                <div className="flex flex-row place-content-between items-center">
                    <p>Service Charge (10%)</p>
                    <p>${ memberGstServiceCharge[name].serviceCharge.toFixed(2) }</p>
                </div>
            </div>
        </GlassContainer>
    )
}
import PersonItemList from "@/app/components/ReceiptViewer/PersonItemList";
import { determineGSTServiceChargeSplit, getReceiptData } from "@/utils/utils"
import { DisplayedReceipt } from "@/db/types";
import { redirect } from "next/navigation";
import GlassBackground from "@/app/components/ui/GlassBackground";
import GlassContainer from "@/app/components/ui/GlassContainer";

export default async function ReceiptView({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const receipt: DisplayedReceipt | null = await getReceiptData(id);
  if (receipt === null) {
    redirect('/404');
  }

  const memberGstServiceCharge = await determineGSTServiceChargeSplit(receipt);
  const totalCost = receipt.items.reduce((acc, item) => {
    const itemCost = item.unitCost * item.quantity;
    return acc + itemCost;
  }, 0) + receipt.gst + receipt.serviceCharge;

  return (
    <div className="relative min-h-screen bg-dark-background text-white">
      <GlassBackground />

      <div className="relative w-full space-y-5 lg:gap-10 p-5 z-10">
        <GlassContainer>
          {/* PayMeLah! Promo */}
          <div className="pb-4 mb-4 border-b border-white/20">
            <h1 className="text-3xl font-bold mb-1">PayMeLah!</h1>
            <p className="text-dark-secondary">Split shared expenses with your friends, easily.</p>
          </div>

          {/* Receipt Details */}
          <div>
            <h2 className="text-2xl font-semibold">{ receipt.title }</h2>
            <p className="text-sm text-dark-secondary mb-3">{ receipt.date }</p>
            <div className="flex flex-col md:flex-row gap-3 place-content-between">
              {/* Receipt Cost Summary */}
              <div>
                <p><span className="font-semibold">Total: </span>${ totalCost }</p>
                <p><span className="font-semibold">GST: </span>${ receipt.gst }</p>
                <p><span className="font-semibold">Service Charge: </span>${ receipt.serviceCharge }</p>
              </div>

              {/* Receipt Members */}
              <div className="flex flex-col gap-2 md:items-end border-t border-white/20 pt-3 md:border-0 md:pt-0">
                <p>Splitting With <span className="font-semibold">{receipt.members.length} People</span></p>
                <div className="inline-flex flex-row flex-wrap gap-2">
                  {receipt.members.map((member, index) => (
                    <PersonTag key={index} name={member} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassContainer>

        <GlassContainer>
          <h2 className="text-2xl font-semibold">Personalised Split</h2>
          <p className="mb-5 text-dark-secondary">Itemised Split of Receipt Items among people in the group</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {receipt.members.map((member, index) => (
              <PersonItemList 
                key={index}
                name={member}
                items={receipt.items}
                memberGstServiceCharge={memberGstServiceCharge}
              />
            ))}
          </div>
        </GlassContainer>
      </div>
    </div>
  )
}

function PersonTag({ name }: { name: string }) {
  return (
      <GlassContainer styles="inline-flex flex-row items-center rounded-full px-2 py-1 gap-2 text-sm">
          <p className="text-white font-semibold h-6 w-6 flex items-center justify-center bg-dark-accent rounded-full">{ name[0].toUpperCase() }</p>
          <p className="text-white font-semibold">{ name }</p>
      </GlassContainer>
  )
}
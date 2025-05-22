import ItemList from "@/app/components/ReceiptViewer/ItemList";
import PersonItemList from "@/app/components/ReceiptViewer/PersonItemList";
import { determineGSTServiceChargeSplit, DisplayedReceipt, getReceiptData } from "@/utils/utils"
import { redirect } from "next/navigation";

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
  const totalCost = receipt.receiptItems.reduce((acc, item) => {
    const itemCost = parseFloat(item.unitCost) * parseInt(item.quantity);
    return acc + itemCost;
  }, 0) + receipt.gst + receipt.serviceCharge;

  return (
    <div className="bg-dark-background text-white flex flex-col items-center gap-5 p-10">
      <div className="bg-dark-container p-5 rounded-lg md:w-[50vw]">
        <div className="pb-4 mb-4 border-b border-dark-border">
          <h1 className="text-3xl font-bold mb-1">PayMeLah!</h1>
          <p className="text-dark-secondary">Split shared expenses with your friends, easily.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">This is a Receipt Name</h2>
          <p className="text-sm text-dark-secondary mb-3">15th May 2025</p>
          <div className="flex place-content-between">
            <div>
              <p><span className="font-semibold">Total: </span>${ totalCost }</p>
              <p><span className="font-semibold">GST: </span>${ receipt.gst }</p>
              <p><span className="font-semibold">Service Charge: </span>${ receipt.serviceCharge }</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p>Splitting With <span className="font-semibold">{receipt.members.length} People</span></p>
              <div className="inline-flex flex-row gap-2">
                {receipt.members.map((member, index) => (
                  <PersonTag key={index} name={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-container p-5 rounded-lg md:w-[50vw]">
          <h2 className="text-2xl font-semibold mb-2">Receipt Items</h2>
          <ItemList items={receipt.receiptItems} members={receipt.members} />
      </div>

      <div className="bg-dark-container p-5 rounded-lg md:w-[50vw]">
          <h2 className="text-2xl font-semibold mb-2">Personalised Split</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {receipt.members.map((member, index) => (
              <div key={index} className="mb-4">
                
              </div>
            ))}
          </div>
          {/* <PersonItem items={receipt.receiptItems} memberGstServiceCharge={memberGstServiceCharge} /> */}
      </div>
    </div>
  )
}

function PersonTag({ name }: { name: string }) {
  return (
    <div className="inline-flex flex-row items-center border border-dark-border rounded-full px-3 py-1 gap-2 text-sm">
      <p className="text-white font-semibold h-6 w-6 flex items-center justify-center bg-dark-accent rounded-full">{ name[0].toUpperCase() }</p>
      <p className="text-white font-semibold">{ name }</p>
    </div>
  )
}
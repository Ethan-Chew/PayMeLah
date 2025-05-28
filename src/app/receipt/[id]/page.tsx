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
  }, 0) + parseFloat(receipt.gst) + parseFloat(receipt.serviceCharge);

  return (
    <div className="min-h-screen bg-dark-background text-white flex flex-col items-center gap-5 p-5 md:p-10">
      <div className="w-full bg-dark-container p-5 rounded-lg md:min-w-[50vw]">
        <div className="pb-4 mb-4 border-b border-dark-border">
          <h1 className="text-3xl font-bold mb-1">PayMeLah!</h1>
          <p className="text-dark-secondary">Split shared expenses with your friends, easily.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{ receipt.name }</h2>
          <p className="text-sm text-dark-secondary mb-3">{ receipt.date }</p>
          <div className="flex flex-col md:flex-row gap-3 place-content-between">
            <div>
              <p><span className="font-semibold">Total: </span>${ totalCost }</p>
              <p><span className="font-semibold">GST: </span>${ receipt.gst }</p>
              <p><span className="font-semibold">Service Charge: </span>${ receipt.serviceCharge }</p>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <p>Splitting With <span className="font-semibold">{receipt.members.length} People</span></p>
              <div className="inline-flex flex-row flex-wrap gap-2">
                {receipt.members.map((member, index) => (
                  <PersonTag key={index} name={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-grow bg-dark-container p-5 md:p-10 rounded-lg md:min-w-[50vw]">
          <h2 className="text-2xl font-semibold mb-2">Receipt Items</h2>
          <ItemList items={receipt.receiptItems} members={receipt.members} />
      </div>

      <div className="w-full bg-dark-container p-5 md:p-10 rounded-lg md:min-w-[50vw]">
          <h2 className="text-2xl font-semibold">Personalised Split</h2>
          <p className="mb-5 text-dark-secondary">Itemised Split of Receipt Items among people in the group</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {receipt.members.map((member, index) => (
              <PersonItemList 
                key={index}
                name={member}
                items={receipt.receiptItems}
                memberGstServiceCharge={memberGstServiceCharge}
              />
            ))}
          </div>
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
import ScanReceiptButton from "./components/ui/ScanReceiptButton";
import TermsAndPrivacy from "./components/TermsAndPrivacy";

export default function Home() {
  return (
    <div className="bg-dark-background text-white">
      <header className="flex items-center">
        <div className="md:w-1/2 z-10 my-10 md:my-32 mx-10">
          <p className="text-xl font-semibold">PayMeLah!</p>
          <p className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dark-accent to-accent leading-[1.3] mb-5">Split shared expenses with your friends, easily.</p>
          <ScanReceiptButton />
        </div>
        <div className="grid-background inset-0 absolute h-[70vh] z-0"></div>
      </header>

      <div className="p-10">
        <div className="mb-20">
          <p className="text-sm font-semibold text-dark-accent">How it Works</p>
          <h2 className="text-4xl mb-5">Splitting finances with just <span className="font-bold">three</span> steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border-2 border-dark-border rounded-lg p-5 box-border">
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-dark-accent to-accent mb-2">1</p>
              <p className="text-lg font-bold">Scan Receipts Instantly</p>
              <p className="text-dark-secondary">Use your camera to scan any receipt, restaurant, grocery, or group expense. Receipt Items are instantly itemised.</p>
            </div>
            <div className="border-2 border-dark-border rounded-lg p-5 box-border">
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-dark-accent to-accent mb-2">2</p>
              <p className="text-lg font-bold">Split Bills, The Smart Way</p>
              <p className="text-dark-secondary">Easily split the receipt among friends or group members. Assign individual items, divide shared costs, or split evenly.</p>
            </div>
            <div className="border-2 border-dark-border rounded-lg p-5 box-border">
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-dark-accent to-accent mb-2">3</p>
              <p className="text-lg font-bold">Share the Total</p>
              <p className="text-dark-secondary">Share the bill with your group in just a tap. Send the link via text, email, or through the app.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row bg-dark-secondary-background px-10 p-20 items-center justify-center place-content-between border-2 border-dark-border rounded-lg gap-16">
          <div>
            <p className="text-sm font-semibold text-dark-accent">Our promise</p>
            <h2 className="text-4xl">Your Privacy, Assured</h2>
            <p className="text-dark-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
          </div>

          <div className="flex flex-row justify-center gap-5 h-full place-content-between">
            <TermsAndPrivacy />
          </div>
        </div>
      </div>
    </div>
  );
}

import GettingStarted from "./components/GettingStarted";
import ScanReceiptButton from "./components/ui/ScanReceiptButton";
import TermsAndPrivacy from "./components/TermsAndPrivacy";

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-background text-white">
      <header className="flex items-center box-border">
        <div className="max-w-1/2 z-10 my-20 mx-10">
          <p className="text-xl font-semibold">PayMeLah!</p>
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dark-accent to-accent leading-[1.3] mb-5">Split shared expenses with your friends, easily.</p>
          <ScanReceiptButton />
        </div>
        <div className="grid-background absolute h-[70vh] z-0"></div>
      </header>

      <div className="p-10">
        <h2 className="text-4xl">Splitting finances with just <span className="font-bold">three</span> steps</h2>
      </div>
    </div>
  );
}

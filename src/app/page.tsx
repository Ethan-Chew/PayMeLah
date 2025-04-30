import GettingStarted from "./components/ui/GettingStarted";
import ScanReceiptButton from "./components/ui/ScanReceiptButton";
import TermsAndPrivacy from "./components/ui/TermsAndPrivacy";


export default function Home() {
  return (
    <div className="min-h-screen bg-dark-background text-white">
      {/* <NavigationBar /> */}

      <div className="p-10 px-10 md:px-20 flex flex-col gap-5">
        <div className="my-5">
          <h1 className="text-4xl font-bold">PayMeLah!</h1>
          <p className="font-semibold text-lg">Split shared expenses with your friends, easily.</p>
          <p className="text-dark-secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
        </div>

        {/* Getting Started Info */}
        <GettingStarted />

        {/* Terms & Privacy */}
        <TermsAndPrivacy />

        {/* Process */}
        <div className="p-4 bg-dark-container rounded-lg">
          <ScanReceiptButton />
          <p className="text-dark-secondary text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  );
}

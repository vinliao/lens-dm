import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { PulseContactList } from "../components/PulseContactList";
import { ContactList } from "../components/ContactList";

export default function Home() {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  return (
    <div className="max-w-lg mx-auto bg-indigo-800 text-pink-200 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-800">
      {isDisconnected ? (
        <>
          <div className="flex flex-col justify-center items-center my-5">
            <p className="mb-2">Connect wallet to check your Lens inbox!</p>
            <ConnectButton label="Connect"></ConnectButton>
          </div>
          <PulseContactList></PulseContactList>
          <div className="flex">
            <div className="flex-1"></div>
            <a
              className="flex items-center space-x-2 m-5"
              href="https://github.com"
            >
              <span>GitHub</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                </svg>
              </span>
            </a>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center my-5">
          <div className="mb-5">
            <ConnectButton
              accountStatus={"address"}
              chainStatus={"none"}
              showBalance={false}
            ></ConnectButton>
          </div>
          <ContactList></ContactList>
        </div>
      )}
    </div>
  );
}

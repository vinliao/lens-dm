import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { PulseContactList } from "../components/PulseContactList";
import { ContactList } from "../components/ContactList";
import { GitHubLink } from "../components/GitHubLink";

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
          <GitHubLink></GitHubLink>
        </>
      ) : (
        <div className="my-5">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-5">
              <ConnectButton
                accountStatus={"address"}
                chainStatus={"none"}
                showBalance={false}
              ></ConnectButton>
            </div>
            <ContactList></ContactList>
          </div>
          <GitHubLink></GitHubLink>
        </div>
      )}
    </div>
  );
}

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { PulseContactList } from "../components/PulseContactList";
import { ContactList } from "../components/ContactList";
import { GitHubLink } from "../components/GitHubLink";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [newChatHandle, setNewChatHandle] = useState("");
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  function goToChatPage() {
    router.push(`/${newChatHandle}`);
    setNewChatHandle("");
  }

  return (
    <div className="max-w-lg mx-auto bg-indigo-800 text-pink-200 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-800 relative">
      {showModal && (
        <div className="h-full z-10 absolute w-full text-lg flex flex-col">
          <div className="flex justify-end bg-indigo-700">
            <input
              type="text"
              placeholder="handlename.lens"
              className="bg-indigo-700 placeholder:text-indigo-400 flex-1 focus:outline-none mr-4 text-lg p-3"
              onChange={(e) => setNewChatHandle(e.target.value)}
              value={newChatHandle}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  goToChatPage();
                }
              }}
            />
            <button
              className="bg-pink-200 text-indigo-700 px-4 font-bold mx-1 my-1.5 rounded-xl focus:outline-none"
              onClick={() => {
                goToChatPage();
              }}
            >
              chat now
            </button>
          </div>
          <div
            className="grow backdrop-blur-lg"
            onClick={() => {
              setShowModal(false);
            }}
          ></div>
        </div>
      )}
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
          <div className="p-3">
            <div className="flex space-x-4 items-baseline">
              <span>handlename.lens</span>
              <span
                className="text-sm text-indigo-400 underline hover:cursor-pointer"
                onClick={() => {
                  disconnect();
                }}
              >
                disconnect
              </span>
            </div>
            <p className="text-4xl font-bold">Chats</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            {/* <ConnectButton
                accountStatus={"address"}
                chainStatus={"none"}
                showBalance={false}
              ></ConnectButton> */}
            <ContactList></ContactList>
          </div>
          <GitHubLink></GitHubLink>
          <p
            onClick={() => {
              setShowModal(true);
            }}
          >
            asdf
          </p>
        </div>
      )}
    </div>
  );
}

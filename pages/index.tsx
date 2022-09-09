import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { PulseContactList } from "../components/PulseContactList";
import { ContactList } from "../components/ContactList";
import { GitHubLink } from "../components/GitHubLink";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { addressToLens, lensToAddress } from "../components/util";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [newChatHandle, setNewChatHandle] = useState("");
  const {
    address,
    isConnecting,
    isConnected,
    isDisconnected,
    isReconnecting,
  } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const { data: lensName, status: lensNameStatus } = useQuery(
    ["user", address],
    () => addressToLens(address)
  );

  async function goToChatPage() {
    const contactAddress = await lensToAddress(newChatHandle);
    if (contactAddress) {
      router.push(`/${contactAddress}`);
    }

    setNewChatHandle("");
  }

  return (
    <div className="max-w-lg mx-auto bg-indigo-800 text-pink-200 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-800 relative">
      {showModal && (
        <div className="h-full z-10 absolute w-full text-lg flex flex-col">
          <div className="flex justify-end bg-indigo-700 py-1">
            <input
              type="text"
              placeholder="handlename.lens"
              className="bg-indigo-700 placeholder:text-indigo-400 flex-1 focus:outline-none mr-4 text-lg p-3"
              onChange={(e) => setNewChatHandle(e.target.value)}
              autoFocus
              value={newChatHandle}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  goToChatPage();
                }
              }}
            />
            <button
              className="bg-pink-200 text-indigo-700 px-4 mx-1.5 my-1.5 rounded-xl focus:outline-none drop-shadow"
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
      {isDisconnected || isConnecting || isReconnecting ? (
        <>
          <div className="flex flex-col justify-center items-center my-5">
            <p className="mb-2">Connect wallet to check your Lens inbox!</p>
            <ConnectButton label="Connect"></ConnectButton>
          </div>
          <PulseContactList></PulseContactList>
          <GitHubLink></GitHubLink>
        </>
      ) : (
        <>
          <div className="p-3">
            <div className="flex justify-end">
              <div
                className="h-8 w-8 bg-pink-200 rounded-full flex justify-center items-center hover:cursor-pointer drop-shadow-lg"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-indigo-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2 items-baseline">
              {lensNameStatus == "success" && lensName ? (
                <span>{lensName}</span>
              ) : (
                <span>{address.slice(0, 5) + "..." + address.slice(-5)}</span>
              )}
              <span>·</span>
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
            <ContactList></ContactList>
          </div>
          <GitHubLink></GitHubLink>
        </>
      )}
    </div>
  );
}

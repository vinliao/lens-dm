import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Contact } from "../components/Contact";
import { PulseContactList } from "../components/PulseContactList";
import EthCrypto from "eth-crypto";

export default function Home() {
  const { address, status } = useAccount();
  const [localPrivkey, setLocalPrivkey] = useState("");
  const [localPubkey, setLocalPubkey] = useState("");

  // on render, get private key from localStorage to react
  // if privkey doesn't exist on localStorage, generate
  useEffect(() => {
    const storagePrivkey = localStorage.getItem("localPriv1234");

    if (!storagePrivkey) {
      const localKeypair = EthCrypto.createIdentity();
      setLocalPrivkey(localKeypair.privateKey);
      setLocalPubkey(localKeypair.publicKey);
    } else {
      setLocalPrivkey(storagePrivkey);
      const pubkeyHex = EthCrypto.publicKeyByPrivateKey(storagePrivkey);
      setLocalPubkey(pubkeyHex);
    }
  }, []);

  const localKeyMessage = {
    address: address,
    localPubkey: localPubkey,
    localPrivkey: localPrivkey,
  };

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: EthCrypto.hash.keccak256(JSON.stringify(localKeyMessage)),
  });

  useEffect(() => {
    if (status == "connected") {
      const storagePrivkey = localStorage.getItem("localPriv1234");
      if (!storagePrivkey) {
        signMessage();
      }
    }
  }, [status]);

  // on sig success
  useEffect(() => {
    if (data) {
      localStorage.setItem("localPriv1234", localPrivkey);
      const ownershipProof = { body: localKeyMessage, sig: data };
      localStorage.setItem(
        "ownershipProof1234",
        JSON.stringify(ownershipProof)
      );
    }
  }, [isSuccess]);

  return (
    <div className="flex justify-center h-screen max-w-6xl mx-auto">
      {/* contact list */}
      <div className="flex-none w-96 bg-neutral-50 border-r-2 border-lime-200 overflow-y-scroll">
        {status == "connected" && (
          <div className="flex justify-between items-center mb-8 mx-2 my-3">
            <input
              type="text"
              placeholder="whoYouWantToDM.lens"
              className="bg-lime-50 rounded-lg flex-1 mr-2 py-1.5 px-3 placeholder:text-lime-300 text-lime-700 focus:outline-none"
            />
            <button onClick={() => console.log("yo")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-lime-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        )}
        <PulseContactList></PulseContactList>
      </div>

      {/* should be hidden if screen too small */}
      <div className="flex-auto bg-neutral-50 flex flex-col justify-center items-center text-neutral-800 space-y-2">
        <p>Connect wallet to check your Lens inbox!</p>
        <ConnectButton></ConnectButton>
      </div>

      {/* chat */}
    </div>
  );
}

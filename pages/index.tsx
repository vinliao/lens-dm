import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import EthCrypto from "eth-crypto";

export default function Home() {
  const [localPrivkey, setLocalPrivkey] = useState("");
  const [localPubkey, setLocalPubkey] = useState("");

  // can do: useEffect status == connected, then signMessage()
  const { address, status } = useAccount();

  const localKeyMessage = {
    address: address,
    localPubkey: localPubkey,
    localPrivkey: localPrivkey,
  };

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: EthCrypto.hash.keccak256(JSON.stringify(localKeyMessage)),
  });

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

  // async function createNostrEventWithDelegate() {
  //   const delegatedEvent = await createEvent(text, nostrPrivkey, pubkeyHex, [
  //     "delegateId",
  //     delegateId,
  //   ]);

  //   // dumping json is problematic on redis lmao
  //   const base64DelegatedEvent = window.btoa(JSON.stringify(delegatedEvent));
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/lpush/wagmi_nostr/${base64DelegatedEvent}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
  //       },
  //     }
  //   );
  //   setText("");
  //   console.log("\n\n\n\n\n");
  //   console.log("DELEGATE EVENT:");
  //   console.log(delegateEvent);
  //   console.log("\n\n\n\n\n");
  //   console.log("EVENT WITH DELEGATED KEYS:");
  //   console.log(delegatedEvent);
  // }

  return (
    <div className="flex flex-col items-center mx-auto max-w-md py-3 px-2">
      <div className="mb-10">
        <ConnectButton></ConnectButton>
      </div>
      <p>{localPrivkey}</p>

      <button onClick={() => signMessage()}>asdffdsa</button>
    </div>
  );
}

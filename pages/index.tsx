import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Contact } from "../components/Contact";
import { PulseContactList } from "../components/PulseContactList";
import EthCrypto from "eth-crypto";
import { ethers } from "ethers";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import supabase from "../components/db";

export default function Home() {
  const { address, status } = useAccount();
  const [localPrivkey, setLocalPrivkey] = useState("");
  const [localPubkey, setLocalPubkey] = useState("");
  const [recipient, setRecipient] = useState("");

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

  async function sendHandshake(recipientString: string) {
    setRecipient("");
    let recipientAddress = "";

    // get eth address
    if (recipientString.slice(-5) == ".lens") {
      const profileQuery = gql`
        query ProfileQuery($request: SingleProfileQueryRequest!) {
          profile(request: $request) {
            ownedBy
          }
        }
      `;

      const profileQueryParams = {
        request: {
          handle: recipientString,
        },
      };

      const client = new ApolloClient({
        uri: "https://api.lens.dev",
        cache: new InMemoryCache(),
      });

      const response = await client.query({
        query: profileQuery,
        variables: profileQueryParams,
      });

      recipientAddress = response.data.profile.ownedBy;
    } else if (ethers.utils.isAddress(recipientString)) {
      recipientAddress = recipientString;
    } else {
      console.log("false");
    }

    if (address != "") {
      createHandshakeMessage(recipientAddress);
    }
  }

  async function createHandshakeMessage(handshakeRecipient: string) {
    const handshakeMessage = {
      message: "establishing handshake",
      toEthAddress: handshakeRecipient,
      fromEthAddress: address,
      fromLocalPubkey: localPubkey,
    };

    const handshakePayload = {
      handshakeMessage,
      sig: EthCrypto.sign(
        localPrivkey,
        EthCrypto.hash.keccak256(JSON.stringify(handshakeMessage))
      ),
    };

    console.log(handshakePayload);

    const dbData = [
      {
        is_handshake: true,
        handshake_recipient: handshakeRecipient,
        handshake: handshakePayload,
      },
    ];

    const { data, error } = await supabase.from("dm").insert(dbData);
    console.log(data);
    console.log(error);
  }

  return (
    <div className="flex justify-center h-screen max-w-6xl mx-auto">
      {/* contact list */}
      <div className="flex-none w-96 bg-neutral-50 border-r-2 border-lime-200 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-lime-100 scrollbar-track-neutral-50">
        {status == "connected" && (
          <div className="flex justify-between items-center mb-8 mx-2 my-3">
            <input
              type="text"
              placeholder="whoYouWantToDM.lens"
              className="bg-lime-50 rounded-lg flex-1 mr-2 py-1.5 px-3 placeholder:text-lime-300 text-lime-700 focus:outline-none"
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
            />
            <button onClick={() => sendHandshake(recipient)}>
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

        <div className="flex px-3 my-4">
          <div className="flex-1"></div>
          <a
            href="https://github.com"
            className="text-lime-700 flex items-center space-x-1"
          >
            <span>GitHub </span>
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

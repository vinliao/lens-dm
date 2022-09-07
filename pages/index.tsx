import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { PulseContactList } from "../components/PulseContactList";
import Link from "next/link";
import { useState, useEffect } from "react";
import supabase from "../components/db";
import { uniq } from "lodash";
import { Contact } from "../components/Contact";

export default function Home() {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();
  const [showEmpty, setShowEmpty] = useState(false);
  const [allChat, setAllChat] = useState([""]);

  async function getAllDMs() {
    const { data, error } = await supabase
      .from("dm")
      .select("dm_cleartext, dm_from, dm_to, timestamp")
      .or(`dm_from.eq.${address},dm_to.eq.${address}`);

    if (data) {
      return data;
    }
  }

  useEffect(() => {
    if (isConnected) {
      getAllDMs().then((res) => {
        console.log(res);
        if (res) {
          if (res.length == 0) {
            setShowEmpty(true);
          } else {
            console.log("calculating unique");
            const nonUniqueContact = res.map((message) => {
              if (message.dm_from == address) return message.dm_to;
              return message.dm_from;
            });
            const uniqueContact = uniq(nonUniqueContact);
            console.log(uniqueContact);
            setAllChat(uniqueContact);
          }
        }
      });
    }
  }, [isConnected]);

  return (
    <div className="max-w-lg mx-auto bg-stone-50 text-rose-900 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-rose-100 scrollbar-track-stone-50 ">
      {isDisconnected ? (
        <>
          <div className="flex flex-col justify-center items-center my-5">
            <p className="mb-2">Connect wallet to check your Lens inbox!</p>
            <ConnectButton></ConnectButton>
          </div>
          <PulseContactList></PulseContactList>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center my-5">
          <ConnectButton></ConnectButton>
          {showEmpty ? <p>is empty!</p> : allChat.map((chat) => <Contact name={chat}/>)}
        </div>
      )}
    </div>
  );
}

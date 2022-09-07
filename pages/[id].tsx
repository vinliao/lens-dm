import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "../components/db";
import { useAccount } from "wagmi";
import { sortBy } from "lodash";

export default function Home() {
  interface ChatInterface {
    dm_to: string;
    dm_from: string;
    timestamp: number;
    dm_cleartext: string;
  }

  const [currentInput, setCurrentInput] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();
  const [sortedChat, setSortedChat] = useState<ChatInterface[]>([
    { dm_to: "", dm_from: "", timestamp: 0, dm_cleartext: "" },
  ]);
  const [chatReady, setChatReady] = useState(false);

  // on page render, get chat
  useEffect(() => {
    getChat();
  }, []);

  async function getChat() {
    const { data: dataFrom, error: errorFrom } = await supabase
      .from("dm")
      .select("dm_cleartext, dm_from, dm_to, timestamp")
      .match({ dm_from: address, dm_to: id });

    const { data: dataTo, error: errorTo } = await supabase
      .from("dm")
      .select("dm_cleartext, dm_from, dm_to, timestamp")
      .match({ dm_from: id, dm_to: address });

    // error if only one side chat, or if no chat
    // huge potential of error here!
    const data = dataFrom!.concat(dataTo);

    setSortedChat(sortBy(data, "timestamp"));
    setChatReady(true);
    console.log(sortedChat);
    // console.log(sortedChat);
  }

  async function sendMessage() {
    // so the animation is "snappy"
    const inputToBeSend = currentInput;
    setCurrentInput("");

    // handle if send to .lens handle instead of
    // raw address
    await supabase.from("dm").insert([
      {
        dm_from: address,
        dm_to: id,
        dm_cleartext: inputToBeSend,
        timestamp: Date.now(),
      },
    ]);
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto bg-indigo-800 text-pink-200 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-rose-100 scrollbar-track-stone-50">
      <div className="flex items-center p-3 space-x-10">
        <Link href={"/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        <span className="font-bold">
          {id?.slice(0, 4) + "..." + id?.slice(-4)}
        </span>
      </div>
      <div className="flex-1 flex flex-col justify-end bg-indigo-800 border-y-2 border-indigo-700">
        {chatReady &&
          sortedChat.map((chat) => {
            if (chat.dm_from == address) {
              return (
                <div className="flex">
                  <div className="flex-1"></div>
                  <span>{chat.dm_cleartext}</span>
                </div>
              );
            } else {
              return (
                <div className="flex">
                  <span>{chat.dm_cleartext}</span>
                  <div className="flex-1"></div>
                </div>
              );
            }
          })}
      </div>
      <div className="p-3 flex justify-between items-center">
        <input
          type="text"
          placeholder="Your message..."
          className="bg-indigo-800 placeholder:text-indigo-400 flex-1 focus:outline-none"
          onChange={(e) => setCurrentInput(e.target.value)}
          value={currentInput}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 hover:cursor-pointer"
          onClick={() => {
            sendMessage();
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </div>
    </div>
  );
}

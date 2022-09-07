import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import supabase from "../components/db";
import { useAccount } from "wagmi";

export default function Home() {
  const [currentInput, setCurrentInput] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();

  async function sendMessage() {
    // so the animation is "snappy"
    const inputToBeSend = currentInput;
    setCurrentInput("");

    // handle if send to .lens handle instead of
    // raw address
    const { data, error } = await supabase
      .from("dm")
      .insert([
        {
          dm_from: address,
          dm_to: id,
          dm_cleartext: inputToBeSend,
          timestamp: Date.now(),
        },
      ]);
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto bg-stone-50 text-rose-900 h-screen overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-rose-100 scrollbar-track-stone-50">
      <div className="flex justify-between items-center p-3">
        <span className="font-bold">
          {id?.slice(0, 4) + "..." + id?.slice(-4)}
        </span>

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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
      </div>
      <div className="flex-1 bg-rose-200">chat body</div>
      <div className="p-3 flex justify-between items-center">
        <input
          type="text"
          placeholder="Your message..."
          className="bg-stone-50 placeholder:text-stone-400 flex-1 focus:outline-none"
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

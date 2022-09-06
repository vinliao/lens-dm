import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { Contact } from "../components/Contact";

export default function Home() {
  return (
    <div className="flex justify-center h-screen max-w-6xl mx-auto">
      {/* contact list */}
      <div className="flex-none w-96 bg-stone-50 border-r-2 border-stone-200">
        <div className="flex justify-between items-center mb-8 mx-2 my-3">
          <input
            type="text"
            placeholder="yourRecipient.lens"
            className="bg-stone-100 rounded-lg flex-1 mr-2 py-1.5 px-3 placeholder:text-stone-400 text-stone-800 focus:outline-none"
          />
          <button onClick={() => console.log("yo")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-stone-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        <Contact
          name={"handlename.lens"}
          lastMessage={"okay man that sounds cool"}
          timestamp={1662436470}
        />
        <Contact
          name={"handlename.lens"}
          lastMessage={"okay man that sounds cool"}
          timestamp={1662436470}
        />

        {/* active chat */}
        <div className="flex flex-col border-b-2 border-stone-100 px-3 py-5 bg-lime-700">
          <div className="flex justify-between">
            <span className="text-lime-50 font-bold">handlename.lens</span>
          </div>
          <p className="text-lime-400">active chat</p>
        </div>

        <Contact
          name={"handlename.lens"}
          lastMessage={"okay man that sounds cool"}
          timestamp={1662436470}
        />
        <Contact
          name={"handlename.lens"}
          lastMessage={"okay man that sounds cool"}
          timestamp={1662436470}
        />
        <Contact
          name={"handlename.lens"}
          lastMessage={"okay man that sounds cool"}
          timestamp={1662436470}
        />
      </div>

      {/* should be hidden if screen too small */}
      <div className="flex-auto bg-stone-50 flex flex-col justify-center items-center text-stone-800 space-y-2">
        <p>Connect wallet to check your Lens inbox!</p>
        <ConnectButton></ConnectButton>
      </div>

      {/* chat */}
    </div>
  );
}

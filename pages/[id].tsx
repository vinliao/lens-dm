import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import supabase from "../components/db";
import { useAccount } from "wagmi";
import { sortBy } from "lodash";
import { ChatBubble } from "../components/ChatBubble";
import { useMutation, useQuery, useQueryClient } from "react-query";

// library without type, red squiggly
// @ts-expect-error
import { SpeechBubble } from "react-kawaii";

export default function Home() {
  const [currentInput, setCurrentInput] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { data, status } = useQuery(["chat", id], getChat, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [data]);

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

    return sortBy(data, "timestamp");
  }

  async function sendMessage() {
    // so the animation is "snappy"
    const inputToBeSend = currentInput;
    setCurrentInput("");

    // handle if send to .lens handle instead of
    // raw address
    const { data, error } = await supabase.from("dm").insert([
      {
        dm_from: address,
        dm_to: id,
        dm_cleartext: inputToBeSend,
        timestamp: Date.now(),
      },
    ]);

    return data;
  }

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(sendMessage, {
    onMutate: async () => {
      const newChat = {
        dm_from: address,
        dm_to: id,
        dm_cleartext: currentInput,
        timestamp: Date.now(),
      };

      // cancel ongoing queries, get chat (for rollback)
      await queryClient.cancelQueries(["chat", id]);
      const previousChats = queryClient.getQueryData(["chat", id]);

      // set local data to add a new one while actually mutating the data
      // @ts-expect-error
      queryClient.setQueryData(["chat", id], (old) => [...old, newChat]);
      return previousChats;
    },

    onError: (err, newTodo, context) => {
      // rollback if the query errors out
      // @ts-expect-error
      queryClient.setQueryData(["chat", id], context.previousTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["chat", id]);
    },
  });

  return (
    <div className="flex flex-col max-w-lg mx-auto bg-indigo-800 text-pink-200 h-screen overflow-y-auto scrollbar relative no-scrollbar">
      <div className="flex items-center p-3 sticky top-0 backdrop-blur-lg space-x-7">
        <Link href={"/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <span className="font-bold text-lg">
          {id?.slice(0, 4) + "..." + id?.slice(-4)}
        </span>
      </div>

      {status == "loading" && (
        <div className="flex justify-center items-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 animate animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </div>
      )}

      {status == "success" && data.length == 0 && (
        <div className="flex flex-col justify-center items-center h-full space-y-4">
          <SpeechBubble size={125} mood="happy" color="#fbcfe8" />
          <p className="text-2xl font-bold">Start chatting!</p>
        </div>
      )}

      {status == "success" && (
        <div className="grow flex flex-col justify-end bg-indigo-800 py-2">
          {data.map((chat) => {
            if (chat.dm_from == address) {
              return (
                <ChatBubble
                  text={chat.dm_cleartext}
                  left={false}
                  key={chat.timestamp}
                ></ChatBubble>
              );
            } else {
              return (
                <ChatBubble
                  text={chat.dm_cleartext}
                  left={true}
                  key={chat.timestamp}
                ></ChatBubble>
              );
            }
          })}
          <div ref={lastMessageRef}></div>
        </div>
      )}

      <div className="p-3 flex justify-between items-center sticky bottom-0 bg-indigo-800 border-t-2 border-indigo-700">
        <input
          type="text"
          placeholder="Your message..."
          className="bg-indigo-800 placeholder:text-indigo-400 flex-1 focus:outline-none mr-4"
          onChange={(e) => setCurrentInput(e.target.value)}
          value={currentInput}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              mutateAsync();
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 hover:cursor-pointer"
          onClick={() => {
            mutateAsync();
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

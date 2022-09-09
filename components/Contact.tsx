import Link from "next/link";
import TimeAgo from "timeago-react";
import enShort from "timeago.js/lib/lang/en_short";
import * as timeago from "timeago.js";
import { useQuery } from "react-query";
import { addressToLens } from "./util";

export function Contact({
  contactDisplay,
  contactAddress,
  lastMessage,
  timestamp,
}: {
  contactDisplay: string;
  contactAddress: string;
  lastMessage: string;
  timestamp: number;
}) {
  timeago.register("en_short", enShort);

  const { data: lensName, status: lensNameStatus } = useQuery(
    ["contact", contactAddress],
    () => addressToLens(contactAddress)
  );

  return (
    <Link href={contactAddress}>
      <div className="flex flex-col py-5 border-b-2 border-indigo-700 px-3 hover:cursor-pointer hover:bg-indigo-700 w-full hover:text-pink-300 transition text-pink-200">
        <div className="flex justify-between items-center">
          {lensNameStatus == "success" && lensName ? (
            <span>{lensName}</span>
          ) : (
            <span>{contactDisplay}</span>
          )}
          <TimeAgo
            datetime={timestamp}
            locale="en_short"
            className="text-indigo-500"
          />
        </div>
        <p className="text-indigo-400 break-words">{lastMessage}</p>
      </div>
    </Link>
  );
}

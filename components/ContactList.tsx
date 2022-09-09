import supabase from "../components/db";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { uniq } from "lodash";
import { Contact } from "./Contact";
import { sortBy } from "lodash";
import { addressToLens, checkIfEthAddress } from "./util";

// library without type, red squiggly
// @ts-expect-error
import { Ghost } from "react-kawaii";

export function ContactList() {
  const { address } = useAccount();

  async function getAllContact() {
    const { data, error } = await supabase
      .from("dm")
      .select("dm_cleartext, dm_from, dm_to, timestamp")
      .or(`dm_from.eq.${address},dm_to.eq.${address}`);

    if (data) {
      const nonUniqueContact = data.map((message) => {
        if (message.dm_from == address) return message.dm_to;
        return message.dm_from;
      });
      const uniqueContact = uniq(nonUniqueContact);

      // get latest chat and timestamp:
      // 1. get all chat per contact
      // 2. sort by timestamp
      // 3. take last

      interface ChatInterface {
        dm_cleartext: string;
        dm_from: string;
        dm_to: string;
        timestamp: number;
        contact_address: string; // the recipient's address
        contact_display: string; // the address display string
      }

      let latestContactChat: ChatInterface[] = [];
      uniqueContact.forEach((contact) => {
        //something here
        const fromContact = data.filter((chat) => chat.dm_from == contact);
        const toContact = data.filter((chat) => chat.dm_to == contact);

        const combined = fromContact.concat(toContact);
        const sorted = sortBy(combined, "timestamp");
        let lastChat = sorted[sorted.length - 1];

        lastChat.contact_address = contact;

        // get contact display (truncated address or lens name)
        let contactDisplay = contact;
        if (checkIfEthAddress(contact)) {
          contactDisplay = contact.slice(0, 5) + "..." + contact.slice(-5);
        }
        // addressToLens(contact).then((res) => {
        //   if (res) {
        //     contactDisplay = res;
        //   }
        // });

        lastChat.contact_display = contactDisplay;
        latestContactChat.push(lastChat);
      });

      console.log(latestContactChat);
      return latestContactChat;
    }
  }

  const { data, status } = useQuery("contacts", getAllContact);
  console.log(data);

  if (status == "loading") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 animate animate-spin"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
      </svg>
    );
  }

  if (data!.length == 0) {
    return (
      <div className="flex flex-col justify-center items-center my-10 space-y-5">
        <Ghost size={125} mood="blissful" color="#fbcfe8" />
        <p>Contact empty, click the add icon and start chatting!</p>
      </div>
    );
  }

  return (
    <>
      {data!.map((chat) => (
        <Contact
          contactDisplay={chat.contact_display}
          contactAddress={chat.contact_address}
          key={chat.timestamp}
          timestamp={chat.timestamp}
          lastMessage={chat.dm_cleartext}
        />
      ))}
    </>
  );
}

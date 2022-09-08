import supabase from "../components/db";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { uniq } from "lodash";
import { Contact } from "./Contact";
import { GitHubLink } from "./GitHubLink";

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
      return uniqueContact;
    }
  }

  const { data, status } = useQuery("contacts", getAllContact);

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

  return (
    <>
      {data!.map((chat) => (
        <Contact name={chat} key={chat} />
      ))}
    </>
  );
}

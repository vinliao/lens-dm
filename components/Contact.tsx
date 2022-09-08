import Link from "next/link";

export function Contact({
  name,
  lastMessage,
  timestamp,
}: {
  name: string;
  lastMessage: string;
  timestamp: number;
}) {
  console.log(name)
  return (
    <Link href={name}>
      <div className="flex flex-col py-5 border-b-2 border-indigo-700 px-3 hover:cursor-pointer w-full hover:text-pink-300 transition text-pink-200">
        <div className="flex justify-between mb-2 items-center">
          <span className="">{name}</span>
          <span className="text-indigo-500">{timestamp}</span>
        </div>
        <p className="text-indigo-400">{lastMessage}</p>
      </div>
    </Link>
  );
}

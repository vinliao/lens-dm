import Link from "next/link";

export function Contact({
  name,
}: // lastMessage,
// timestamp,
{
  name: string;
  // lastMessage: string;
  // timestamp: number;
}) {
  return (
    <Link href={name}>
      <div className="flex flex-col py-5 border-b-2 border-indigo-700 px-3 hover:cursor-pointer w-full hover:text-pink-300 transition text-pink-200">
        <div className="flex justify-between mb-2 items-center">
          <span className="">{name}</span>
          {/* skip timestamp for now */}
          {/* <span className="text-stone-400">3m</span>
        </div>
        <p className="text-stone-400">hello world how are you</p> */}
          <span className="bg-indigo-600 h-4 w-1/5 rounded-full animate animate-pulse"></span>
        </div>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-400 h-16 w-full rounded-lg animate animate-pulse"></div>
      </div>
    </Link>
  );
}

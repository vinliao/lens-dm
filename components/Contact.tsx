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
      <div className="flex flex-col py-5 border-b-2 border-rose-50 px-3 hover:cursor-pointer w-full hover:text-rose-600 transition">
        <div className="flex justify-between mb-2 items-center">
          <span className="">{name}</span>
          {/* skip timestamp for now */}
          {/* <span className="text-stone-400">3m</span>
        </div>
        <p className="text-stone-400">hello world how are you</p> */}
          <span className="animate animate-pulse bg-rose-50 h-4 w-1/12 rounded-full"></span>
        </div>
        <div className=" animate animate-pulse bg-rose-50 h-16 w-full"></div>
      </div>
    </Link>
  );
}

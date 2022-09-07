export function Contact({
  name,
  lastMessage,
  timestamp,
}: {
  name: string;
  lastMessage: string;
  timestamp: number;
}) {
  return (
    <div className="flex flex-col py-5 border-b-2 border-rose-100 px-3">
      <div className="flex justify-between">
        <span className="text-stone-800 font-bold">{name}</span>
        {/* skip timestamp for now */}
        {/* <span>{timestamp}</span> */}
      </div>
      <p className="text-stone-500">{lastMessage}</p>
    </div>
  );
}

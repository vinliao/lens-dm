export function PulseContact() {
  return (
    <div className="animate-pulse flex flex-col py-5 border-b-2 border-stone-100 px-3 pr-5">
      <div className="flex justify-between mb-2">
        <span className="bg-rose-100 h-4 w-2/5 rounded-full"></span>
        {/* skip timestamp for now */}
        {/* <span>{timestamp}</span> */}
      </div>
      <div className=" bg-rose-50 h-16 w-full"></div>
    </div>
  );
}

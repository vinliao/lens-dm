export function PulseContact() {
  return (
    <div className="animate-pulse flex flex-col py-5 border-b-2 border-indigo-700 px-3 pr-5">
      <div className="flex justify-between mb-2">
        <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-4 w-2/5 rounded-full"></span>
        <span className="bg-indigo-600 h-4 w-1/5 rounded-full"></span>
      </div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-400 h-16 w-full rounded-lg"></div>
    </div>
  );
}

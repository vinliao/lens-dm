export function ChatBubble({ text, left }: { text: string; left: boolean }) {
  if (left) {
    return (
      <div className="flex">
        <span className="px-2 py-1 mx-2 my-1 bg-indigo-600 rounded-r-xl rounded-bl-xl break-all">
          {text}
        </span>
        <div className="grow shrink-0 w-1/6"></div>
      </div>
    );
  } else {
    return (
      <div className="flex">
        <div className="grow shrink-0 w-1/6"></div>
        <span className="px-2 py-1 mx-2 my-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-l-xl rounded-tr-xl break-all">
          {text}
        </span>
      </div>
    );
  }
}

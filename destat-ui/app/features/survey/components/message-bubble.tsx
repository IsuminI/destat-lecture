import { User2Icon } from "lucide-react";

export default function MessageBubble({
  isSender,
  sender,
  message,
  created_at,
}: {
  isSender: boolean;
  sender: string;
  message: string;
  created_at: string;
}) {
  return (
    <div>
      {isSender ? (
        <div className="flex flex-row items-center justify-end gap-1">
          <div className="flex flex-col justify-center items-end w-[70%]">
            <h1 className="font-extrabold text-xs">
              {sender.slice(0, 5)}...{sender.slice(sender.length - 3)}
            </h1>
            <span className="text-xs bg-primary/30 px-2 py-1 rounded-3xl">
              {message}
            </span>
          </div>
          <User2Icon />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-1">
          <User2Icon />
          <div className="flex flex-col justify-center w-[70%]">
            <h1 className="font-extrabold text-xs">
              {sender.slice(0, 5)}...{sender.slice(sender.length - 3)}
            </h1>
            <span className="text-xs">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

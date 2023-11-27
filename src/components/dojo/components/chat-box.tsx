"use client";

import type { MessageType } from "@axflow/models/shared";

export function ChatBox({ messages }: { messages: MessageType[] }) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-auto whitespace-pre-line rounded border border-white p-2">
      {messages?.length === 0 && (
        <div className="p-4 text-stone-300">No messages yet</div>
      )}
      {messages?.map((message) => {
        return (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "mr-32 self-start rounded bg-white p-2 text-black"
                : "ml-32 self-end rounded bg-emerald-200 p-2 text-black"
            }
          >
            {message.content}
          </div>
        );
      })}
    </div>
  );
}

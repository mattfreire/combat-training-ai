import { OpenAIChat } from '@axflow/models/openai/chat';
import { type MessageType, StreamingJsonResponse } from '@axflow/models/shared';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { messages }  = (await request.json()) as { messages: MessageType[] };

  const stream = await OpenAIChat.streamTokens({
    messages: [{
      content: "You are a helpful bot",
      role: 'system',
    },
      ...messages.map((msg) => ({ role: msg.role, content: msg.content }))
    ],
    model: "gpt-3.5-turbo",
  }, { 
    apiKey: process.env.OPENAI_API_KEY,
   });
  return new StreamingJsonResponse(stream);
}


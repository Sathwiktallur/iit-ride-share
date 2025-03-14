import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Send } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

type ChatBoxProps = {
  rideId: number;
  isCreator: boolean;
};

export default function ChatBox({ rideId, isCreator }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First, fetch existing messages
    fetch(`/api/rides/${rideId}/messages`)
      .then((res) => res.json())
      .then(setMessages);

    // Then set up WebSocket connection
    const wsConnection = new WebSocket(`ws://${window.location.host}/ws`);

    wsConnection.onopen = () => {
      // Authenticate the WebSocket connection
      wsConnection.send(JSON.stringify({
        type: 'auth',
        payload: { userId: user?.id }
      }));
    };

    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message' && data.payload.rideId === rideId) {
        setMessages(prev => [...prev, data.payload]);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    setWs(wsConnection);

    return () => {
      wsConnection.close();
    };
  }, [rideId, user?.id]);

  const sendMessage = () => {
    if (!ws || !newMessage.trim()) return;

    ws.send(JSON.stringify({
      type: 'chat_message',
      payload: {
        rideId,
        message: newMessage.trim()
      }
    }));

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg bg-white">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.userId === user?.id
                    ? isCreator
                      ? 'bg-green-100 text-green-900'
                      : 'bg-blue-100 text-blue-900'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
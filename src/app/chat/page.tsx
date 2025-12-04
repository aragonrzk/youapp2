"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  time: string;
}

const contacts = [
  { id: 1, name: "Helena Choi", img: "/images/user1.jpg", lastMsg: "Hey! How are you?", online: true },
  { id: 2, name: "Jessica Jane", img: "/images/user2.jpg", lastMsg: "That sounds great!", online: false },
  { id: 3, name: "Jenny Wilson", img: "/images/user3.jpg", lastMsg: "See you tomorrow 😊", online: true },
  { id: 4, name: "Eleanor Pena", img: "/images/user4.jpg", lastMsg: "Thanks for the match!", online: false },
];

export default function ChatPage() {
  const { token } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedContact = contacts.find((c) => c.id === selectedChat);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInput("");

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: getAutoReply(input),
          sender: "other",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
  };

  const getAutoReply = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) return "Hey there! 👋 Nice to meet you!";
    if (lower.includes("horoscope") || lower.includes("zodiac")) return "I love astrology! What's your sign? ✨";
    if (lower.includes("how are you")) return "I'm doing great, thanks for asking! How about you?";
    if (lower.includes("date") || lower.includes("meet")) return "That sounds lovely! When are you free? 💕";
    return "That's interesting! Tell me more about yourself 😊";
  };

  // Chat list view
  if (!selectedChat) {
    return (
      <div className="min-h-screen pb-24">
        <header className="flex items-center justify-between px-4 py-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">←</button>
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="w-10" />
        </header>

        <div className="px-4">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChat(c.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="relative">
                <Image src={c.img} alt={c.name} width={48} height={48} className="rounded-full object-cover" />
                {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-400 truncate">{c.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>

        <nav className="bottom-nav">
          <Link href="/" className="p-2">🏠</Link>
          <Link href="/profile" className="p-2">❤️</Link>
          <Link href="/chat" className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full"><span>💬</span></Link>
          <Link href="/profile" className="p-2">👤</Link>
        </nav>
      </div>
    );
  }

  // Chat conversation view
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
        <button onClick={() => setSelectedChat(null)} className="text-gray-500">←</button>
        <Image src={selectedContact?.img || ""} alt="" width={40} height={40} className="rounded-full" />
        <div className="flex-1">
          <p className="font-semibold">{selectedContact?.name}</p>
          <p className="text-xs text-green-500">{selectedContact?.online ? "Online" : "Offline"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">Start a conversation with {selectedContact?.name}!</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender === "user" ? "bg-primary text-dark" : "bg-white shadow"}`}>
              <p>{m.text}</p>
              <p className={`text-xs mt-1 ${m.sender === "user" ? "text-dark/60" : "text-gray-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          className="flex-1 input-field"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-primary rounded-xl font-semibold">Send</button>
      </div>
    </div>
  );
}

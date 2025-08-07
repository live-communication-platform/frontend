"use client";

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useSession, signOut } from "next-auth/react";
import apiConfig from "../../config/apiConfig";

interface Message {
    user: string;
    text: string;
    timestamp: string;
}

let socket: Socket;

export default function CommunicationPage() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [accountOpen, setAccountOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!session?.user?.name) return;

        socket = io(apiConfig.baseUrl, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        socket.on("newMessage", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("notification", (data) => {
            setMessages((prev) => [
                ...prev,
                {
                    user: "System",
                    text: data.message,
                    timestamp: new Date().toISOString(),
                },
            ]);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
        });

        return () => {
            socket.disconnect();
        };
    }, [session]);

    const sendMessage = () => {
        if (!input.trim() || !session?.user?.name) return;

        socket.emit("newMessage", {
            user: session.user.name,
            text: input.trim(),
        });

        setInput("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close dropdown on outside click
    useEffect(() => {
        if (!accountOpen) return;
        function handleClick(e: MouseEvent) {
            if (
                accountRef.current &&
                !accountRef.current.contains(e.target as Node)
            ) {
                setAccountOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [accountOpen]);

    if (!session) return <p className="text-center text-white">Loading...</p>;

    return (
        <div className="flex flex-col h-screen w-full max-w-3xl mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">Live Chat</h1>
                <div className="relative" ref={accountRef}>
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none"
                        onClick={() => setAccountOpen((open) => !open)}
                        aria-haspopup="true"
                        aria-expanded={accountOpen}
                    >
                        Account
                    </button>
                    {accountOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md p-4 z-10">
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Email:</strong> {session.user?.email}
                            </p>
                            <button
                                onClick={() =>
                                    signOut({ callbackUrl: "/auth" })
                                }
                                className="w-full text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto bg-white/10 rounded p-4 space-y-2 border border-white/20 shadow-inner">
                {messages.map((msg, idx) => {
                    const isCurrentUser = msg.user === session.user?.name;
                    const isSystem = msg.user === "System";

                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg shadow-md max-w-[80%] ${
                                isSystem
                                    ? "bg-yellow-300 text-black mx-auto text-center"
                                    : isCurrentUser
                                    ? "bg-blue-600 text-white self-end ml-auto"
                                    : "bg-gray-800 text-white self-start mr-auto"
                            }`}
                        >
                            {!isSystem && (
                                <p className="text-sm font-bold mb-1">
                                    {msg.user}
                                </p>
                            )}
                            <p>{msg.text}</p>
                            <p className="text-xs text-gray-200 mt-1 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded border border-gray-300 text-white bg-gray-900 placeholder-gray-400"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

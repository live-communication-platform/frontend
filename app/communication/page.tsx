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

export default function CommunicationPage() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [accountOpen, setAccountOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const username = session?.user?.name || session?.user?.email;
        if (!username) return;

        if (!socketRef.current) {
            socketRef.current = io(apiConfig.baseUrl, {
                transports: ["websocket"],
            });
        }
        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("Connected to WebSocket server");
        });

        socket.on("newMessage", (message: Message) => {
            console.log("Received newMessage from server:", message);
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
            socketRef.current = null;
        };
    }, [session]);

    const sendMessage = () => {
        const username = session?.user?.name || session?.user?.email;
        if (!input.trim() || !username) return;
        console.log("Sending message:", input.trim());
        socketRef.current?.emit("newMessage", {
            user: username,
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

    if (typeof window !== "undefined" && window.location.port !== "3001") {
        return (
            <div className="flex items-center justify-center h-screen bg-red-900 text-white text-xl font-bold">
                Please use http://localhost:3001 to access the app frontend.
            </div>
        );
    }

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
                                    signOut({
                                        callbackUrl:
                                            "http://localhost:3001/auth",
                                    })
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
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 rounded p-4 space-y-3 border border-white/20 shadow-inner">
                {messages.map((msg, idx) => {
                    const isCurrentUser =
                        msg.user ===
                        (session.user?.name || session.user?.email);
                    const isSystem = msg.user === "System";

                    return (
                        <div
                            key={idx}
                            className={
                                isSystem
                                    ? "flex justify-center"
                                    : isCurrentUser
                                    ? "flex justify-end"
                                    : "flex justify-start"
                            }
                        >
                            <div
                                className={`relative max-w-[75%] px-4 py-3 rounded-2xl shadow-md transition-all
                                    ${
                                        isSystem
                                            ? "bg-yellow-200 text-gray-900 text-center"
                                            : isCurrentUser
                                            ? "bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-700 text-white self-end"
                                            : "bg-white/90 text-gray-900 self-start"
                                    }
                                    ${
                                        isSystem
                                            ? "mx-auto"
                                            : isCurrentUser
                                            ? "ml-12"
                                            : "mr-12"
                                    }
                                `}
                                style={{
                                    borderBottomRightRadius: isCurrentUser
                                        ? 0
                                        : undefined,
                                    borderBottomLeftRadius:
                                        !isCurrentUser && !isSystem
                                            ? 0
                                            : undefined,
                                }}
                            >
                                {!isSystem && (
                                    <p
                                        className={`text-xs font-semibold mb-1 ${
                                            isCurrentUser
                                                ? "text-blue-200"
                                                : "text-indigo-700"
                                        }`}
                                    >
                                        {msg.user}
                                    </p>
                                )}
                                <p className="break-words text-base">
                                    {msg.text}
                                </p>
                                <p
                                    className={`text-[0.7rem] mt-1 ${
                                        isCurrentUser
                                            ? "text-blue-200 text-right"
                                            : isSystem
                                            ? "text-gray-700 text-center"
                                            : "text-gray-500 text-left"
                                    }`}
                                >
                                    {new Date(msg.timestamp).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" }
                                    )}
                                </p>
                            </div>
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

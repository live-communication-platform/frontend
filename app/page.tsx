"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/communication");
        }
    }, [session, router]);

    const handleStart = () => {
        if (session) {
            router.push("/communication");
        } else {
            router.push("/auth");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Decorative gradient blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-48 -top-48 w-[32rem] h-[32rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-blob"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-56 -bottom-56 w-[32rem] h-[32rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-25 blur-3xl animate-blob animation-delay-2000"
            />

            <main className="relative z-10 w-full max-w-5xl px-4 md:px-6 lg:px-8 mx-auto">
                <section className="bg-[rgba(255,255,255,0.04)] dark:bg-[rgba(10,10,10,0.5)] backdrop-blur-md border border-white/8 rounded-3xl p-6 md:p-10 lg:p-14 shadow-2xl">
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden
                                >
                                    <path
                                        d="M3 12h18"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M12 3v18"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
                                    Live Communication Platform
                                </h1>
                                <p className="mt-1 text-sm md:text-base lg:text-lg text-white/70 max-w-2xl">
                                    Real-time messaging and collaboration —
                                    secure, fast and beautiful. Get started in
                                    seconds.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleStart}
                                className="inline-flex items-center gap-3 px-6 py-3 text-base lg:text-lg rounded-lg font-medium text-white shadow-md transition transform hover:-translate-y-0.5 focus:outline-none bg-gradient-to-r from-indigo-500 to-pink-500"
                            >
                                Start Communication
                            </button>
                        </div>
                    </header>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="p-4 rounded-lg bg-white/3 border border-white/6">
                            <h3 className="font-medium text-white text-lg">
                                Real-time
                            </h3>
                            <p className="text-sm text-white/70 mt-1">
                                Low-latency messaging and presence updates.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/3 border border-white/6">
                            <h3 className="font-medium text-white text-lg">
                                Secure
                            </h3>
                            <p className="text-sm text-white/70 mt-1">
                                End-to-end patterns and robust auth flows.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/3 border border-white/6">
                            <h3 className="font-medium text-white text-lg">
                                Productive
                            </h3>
                            <p className="text-sm text-white/70 mt-1">
                                Keyboard friendly UI and quick onboarding.
                            </p>
                        </div>
                    </div>

                    <footer className="mt-10 text-sm text-white/60">
                        <span>Need help? </span>
                        <a href="#" className="text-indigo-300 underline">
                            Contact support
                        </a>
                    </footer>
                </section>
            </main>

            {/* local animation styles */}
            <style jsx>{`
                .animate-blob {
                    animation: blob 8s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes blob {
                    0% {
                        transform: translateY(0px) scale(1);
                    }
                    33% {
                        transform: translateY(-20px) scale(1.05);
                    }
                    66% {
                        transform: translateY(10px) scale(0.95);
                    }
                    100% {
                        transform: translateY(0px) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

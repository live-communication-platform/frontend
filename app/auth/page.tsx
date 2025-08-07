"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import apiConfig from "../../config/apiConfig";

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const router = useRouter();

    const validate = () => {
        if (!email.trim()) {
            setErrorMsg("Email is required.");
            return false;
        }
        if (!password.trim() || password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return false;
        }
        if (isSignUp && (!username.trim() || username.length < 3)) {
            setErrorMsg("Username must be at least 3 characters.");
            return false;
        }
        setErrorMsg(null);
        return true;
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isSignUp) {
                const res = await fetch(`${apiConfig.baseUrl}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });
                if (res.ok) {
                    setIsSignUp(false);
                    setUsername("");
                    setPassword("");
                    setEmail("");
                    alert("Sign-up successful! Please sign in.");
                } else {
                    const errorData = await res.json();
                    setErrorMsg(errorData.message || "Sign-up failed.");
                }
            } else {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });
                if (result?.ok) {
                    router.push("/communication");
                } else {
                    setErrorMsg("Sign-in failed: Invalid email or password.");
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            setErrorMsg(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl animate-blob"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-40 -bottom-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-25 blur-3xl animate-blob animation-delay-2000"
            />

            <main className="relative z-10 w-full max-w-xl mx-4">
                <section className="bg-[rgba(255,255,255,0.06)] dark:bg-[rgba(10,10,10,0.55)] backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <header className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                            {/* simple brand mark */}
                            <svg
                                width="26"
                                height="26"
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
                            <h1 className="text-2xl font-semibold text-white">
                                Welcome to LVC
                            </h1>
                            <p className="text-sm text-white/70 -mt-0.5">
                                {isSignUp
                                    ? "Create your account"
                                    : "Sign in to continue"}
                            </p>
                        </div>
                    </header>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <label className="block">
                                <span className="text-xs text-white/80">
                                    Username
                                </span>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Your username"
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                        aria-label="Username"
                                    />
                                    <svg
                                        className="absolute right-3 top-3 w-5 h-5 text-white/70"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                        />
                                        <path
                                            d="M3 21a9 9 0 0118 0"
                                            stroke="currentColor"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </label>
                        )}

                        <label className="block">
                            <span className="text-xs text-white/80">Email</span>
                            <div className="mt-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    aria-label="Email"
                                />
                                <svg
                                    className="absolute right-3 top-3 w-5 h-5 text-white/70"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M3 7l9 6 9-6"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </label>

                        <label className="block">
                            <span className="text-xs text-white/80">
                                Password
                            </span>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-12"
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-2 top-2.5 px-2 py-1 rounded text-white/70 hover:text-white/90"
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 3l18 18"
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M9.88 9.88A3 3 0 0114.12 14.12"
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M2.02 12S4.73 7 12 7c2.03 0 3.7.58 5.1 1.4"
                                                stroke="currentColor"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M12 5c7 0 9.98 6.86 9.98 7a14.78 14.78 0 01-1.92 3.1A16.2 16.2 0 0112 19c-7 0-9.98-6.86-9.98-7S5 5 12 5z"
                                                stroke="currentColor"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                                stroke="currentColor"
                                                strokeWidth="1.2"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </label>

                        {errorMsg && (
                            <div className="text-sm text-red-300 bg-red-900/20 border border-red-600/20 px-3 py-2 rounded">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 inline-flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-medium text-white shadow-md transition transform hover:-translate-y-0.5 focus:outline-none ${
                                    loading ? "opacity-80 cursor-wait" : ""
                                } bg-gradient-to-r from-indigo-500 to-pink-500`}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="white"
                                                strokeOpacity="0.25"
                                                strokeWidth="3"
                                            />
                                            <path
                                                d="M22 12a10 10 0 00-10-10"
                                                stroke="white"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span>
                                            {isSignUp
                                                ? "Creating..."
                                                : "Signing in..."}
                                        </span>
                                    </>
                                ) : (
                                    <span>
                                        {isSignUp
                                            ? "Create account"
                                            : "Sign in"}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsSignUp((s) => !s)}
                                className="px-4 py-2 rounded-lg text-sm bg-white/6 border border-white/8 text-white/90 hover:bg-white/10"
                            >
                                {isSignUp
                                    ? "Have account? Sign in"
                                    : "Create account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-white/60">
                        By continuing you agree to our{" "}
                        <span className="underline">Terms</span> and{" "}
                        <span className="underline">Privacy</span>.
                    </div>
                </section>

                <footer className="mt-6 text-center text-sm text-white/60">
                    <span>Need help? </span>
                    <a href="#" className="text-indigo-300 underline">
                        Contact support
                    </a>
                </footer>
            </main>

            {/* small credit / accessibility */}
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

import NextAuth, { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { User } from "next-auth";
import apiConfig from "../../../../config/apiConfig";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            username?: string | null; // Extend session user to include username
        };
    }
    interface User {
        username?: string | null; // Extend User type to include username
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${apiConfig.baseUrl}/auth/signin`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(credentials),
                        }
                    );

                    const responseData = await res.json();

                    if (!res.ok) {
                        throw new Error(responseData.message || "Login failed");
                    }

                    if (responseData && responseData.access_token) {
                        return {
                            id: responseData.user_id || "unknown",
                            email: credentials?.email,
                            name: responseData.name || null,
                            username: responseData.username || null, // Include username from backend response
                        };
                    } else {
                        throw new Error(
                            "Invalid user data returned from backend"
                        );
                    }
                } catch (error) {
                    console.error("Authorize error:", error);
                    throw new Error(
                        error instanceof Error
                            ? error.message
                            : "Unknown error occurred"
                    );
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: AdapterUser | User }) {
            if (user) {
                token.id = user.id;
                token.email = user.email || undefined;
                token.name = user.name || undefined;
                token.username = (user.username as string) || undefined; // Explicitly cast username to string
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = {
                email: token.email,
                username:
                    typeof token.username === "string" ? token.username : null, // Map username from token to session
            };
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

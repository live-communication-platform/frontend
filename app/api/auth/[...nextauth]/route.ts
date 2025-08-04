import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Call your backend login endpoint
                const res = await fetch("http://localhost:3000/auth/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                });
                const user = await res.json();
                if (res.ok && user?.access_token) {
                    // Attach token to user object
                    return { ...user, email: credentials?.email };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.access_token) {
                token.access_token = user.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.access_token) {
                session.access_token = token.access_token;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
    pages: {
        signIn: "/signin",
    },
});

export { handler as GET, handler as POST };

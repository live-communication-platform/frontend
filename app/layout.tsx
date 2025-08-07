// app/layout.tsx
import "./globals.css";
import Providers from "@/components/providers";

export const metadata = {
    title: "Live Communication Platform",
    description: "Sign in to Live Communication Platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

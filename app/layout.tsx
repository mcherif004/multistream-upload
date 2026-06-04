import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SocialAuthProvider } from "@/lib/social/social-auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MultiStream Upload",
  description: "Single Upload, Multiple Metadata",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} bg-black font-sans text-zinc-100 antialiased`}>
        <SocialAuthProvider>{children}</SocialAuthProvider>
      </body>
    </html>
  );
}

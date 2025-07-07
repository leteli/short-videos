import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Short videos chat",
  description: "Web chat app for text, audio and video messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}

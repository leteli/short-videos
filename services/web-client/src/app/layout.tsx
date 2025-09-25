import type { Metadata } from "next";
import { EffectorNext } from "@effector/next";
import "./globals.css";
import "../utils/styles/global.scss";
import styles from "./page.module.scss";

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
        <EffectorNext>
          <div className={styles.page}>
            {children}
          </div>
        </EffectorNext>
      </body>
    </html>
  );
}

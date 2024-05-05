import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.scss";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import styles from './layout.module.scss';

const noto = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aurum AI",
  description: "Next generation automation and intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${noto.className} ${styles.body}`}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LearnAudibly",
  description: "Convert text to audio & more with Murf AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 👇 Apply theme using className */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Navbar />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

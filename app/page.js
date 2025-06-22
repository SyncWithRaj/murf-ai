'use client';
import Link from "next/link";
import {
  Brain,
  FileAudio,
  UploadCloud,
  Settings2,
  PlayCircle,
  BookOpenCheck,
  ClipboardCheck,
  TextQuote,
  Sparkle,
  Sun, Moon
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";


export default function Home() {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1f1c2c] via-[#302b63] to-[#24243e] text-white transition-all font-sans">
      <div className="absolute top-4 right-6">
        <button
          onClick={toggleDarkMode}

          className="bg-white dark:bg-gray-700 shadow-md rounded-full p-2 transition-all"
        >
          {darkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
        </button>
      </div>
      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Brain size={40} className="text-purple-300" />
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-400 drop-shadow-lg">
            LearnAudibly
          </h1>
        </div>
        <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Convert your study notes or PDFs into natural-sounding audio with Murf AI.
          Learn smarter - anywhere, anytime, hands-free!
        </p>
        <Link href="/navigation">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all text-lg font-semibold cursor-pointer">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-[#1b1b2f] transition-all">
        <div className="flex justify-center items-center gap-3 mb-12">
          <Settings2 size={28} className="text-blue-300" />
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
            Key Features
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<FileAudio size={36} />} title="Text to Speech" desc="Convert typed or pasted content into realistic audio in seconds." />
          <FeatureCard icon={<UploadCloud size={36} />} title="PDF Upload & Narration" desc="Upload your notes or books in PDF format - get them read aloud." />
          <FeatureCard icon={<ClipboardCheck size={36} />} title="AI Summarizer" desc="Summarize lengthy text before converting, powered by Gemini." />
          <FeatureCard icon={<Settings2 size={36} />} title="Voice & Style Control" desc="Choose from various Murf voice options - formal, casual, promo, and more." />
          <FeatureCard icon={<PlayCircle size={36} />} title="Audio Player with Controls" desc="Built-in audio player with timestamped sections and skip controls." />
          <FeatureCard icon={<Brain size={36} />} title="Smart Multitasking" desc="Listen while you revise, walk, cook, or travel - hands-free learning!" />
          <FeatureCard icon={<TextQuote size={36} />} title="Natural Language Output" desc="Outputs feel like a real person is reading - not robotic tones." />
          <FeatureCard icon={<BookOpenCheck size={36} />} title="Bookmarking (coming soon)" desc="Save where you stopped listening - resume anytime without hassle." />
          <FeatureCard icon={<Sparkle size={36} />} title="Minimal, Clean UI" desc="No distractions. Just upload, summarize, listen, and learn effortlessly." />
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#1b1b2f] to-[#0f0f1a]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <BookOpenCheck size={28} className="text-purple-300" />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Why LearnAudibly?
            </h2>
          </div>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            LearnAudibly is built for learners, professionals, and anyone who wants to consume content without staring at screens.
            Whether you&apos;re on the go or just tired of reading, our AI tools make learning smooth, human-like, and engaging.
          </p>

          <Link href="/navigation">
            <button className=" cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-md transition-all text-lg font-semibold">
              Try It Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-white/10">
        © {new Date().getFullYear()} LearnAudibly — Made with ❤️ by Raj
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#22223b]/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-purple-400/40 transition-all border border-white/10 hover:border-purple-400/30">
      <div className="text-purple-300 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

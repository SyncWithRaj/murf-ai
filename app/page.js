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
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 transition-all font-sans">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-purple-400 drop-shadow-sm">
          🎓 LearnAudibly
        </h1>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Convert study notes or PDFs into natural-sounding audio with Murf AI.
          Learn smarter — anywhere, anytime, hands-free!
        </p>
        <Link href="/convert">
          <button className="bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all text-lg font-semibold">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-all">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          🔑 Key Features
        </h2>
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<FileAudio size={36} />} title="Text to Speech" desc="Convert typed or pasted content into realistic audio in seconds." />
          <FeatureCard icon={<UploadCloud size={36} />} title="PDF Upload & Narration" desc="Upload your notes or books in PDF format — get them read aloud." />
          <FeatureCard icon={<ClipboardCheck size={36} />} title="AI Summarizer" desc="Summarize lengthy text before converting, powered by Gemini." />
          <FeatureCard icon={<Settings2 size={36} />} title="Voice & Style Control" desc="Choose from various Murf voice options — formal, casual, promo, and more." />
          <FeatureCard icon={<PlayCircle size={36} />} title="Audio Player with Controls" desc="Built-in audio player with timestamped sections and skip controls." />
          <FeatureCard icon={<Brain size={36} />} title="Smart Multitasking" desc="Listen while you revise, walk, cook, or travel — hands-free learning!" />
          <FeatureCard icon={<TextQuote size={36} />} title="Natural Language Output" desc="Outputs feel like a real person is reading — not robotic tones." />
          <FeatureCard icon={<BookOpenCheck size={36} />} title="Bookmarking (coming soon)" desc="Save where you stopped listening — resume anytime without hassle." />
          <FeatureCard icon={<Sparkle size={36} />} title="Minimal, Clean UI" desc="No distractions. Just upload, summarize, listen, and learn effortlessly." />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-950 transition-all">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-purple-400">
            Why LearnAudibly?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            LearnAudibly is built for learners, professionals, and anyone who wants to consume content without staring at screens.
            Whether you're on the go or just tired of reading, our AI tools make learning smooth, human-like, and engaging.
          </p>
          <Link href="/convert">
            <button className="bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow transition-all text-lg font-semibold">
              Try It Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} LearnAudibly — Made with ❤️ by Raj
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-blue-300 dark:hover:border-purple-400">
      <div className="text-blue-600 dark:text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

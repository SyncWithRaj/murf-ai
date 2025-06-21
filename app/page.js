'use client';
import Link from "next/link";
import {
  Brain,
  FileAudio,
  UploadCloud,
  Settings2,
  PlayCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 transition-all">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-purple-400">
          🎓 LearnAudibly
        </h1>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Convert your study notes to natural-sounding voice using Murf AI. Learn on the go – hands-free!
        </p>
        <Link href="/convert">
          <button className="bg-blue-600 dark:bg-purple-600 hover:bg-blue-700 dark:hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all text-lg font-semibold">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-all">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          Key Features
        </h2>
        <div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<FileAudio size={36} />} title="Voice Conversion" desc="Convert any text into high-quality natural-sounding speech." />
          <FeatureCard icon={<Settings2 size={36} />} title="Voice & Style Control" desc="Choose from various voices and speaking styles like Promo or Conversational." />
          <FeatureCard icon={<PlayCircle size={36} />} title="Custom Player" desc="Enjoy a smooth audio playback experience with timestamp & skip features." />
          <FeatureCard icon={<Brain size={36} />} title="Learn Anywhere" desc="Listen to your notes during commute, workouts, or while relaxing." />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-100 dark:from-gray-900 dark:to-gray-950 transition-all">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-purple-400">Why LearnAudibly?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            LearnAudibly helps students, professionals, and lifelong learners absorb information more effectively by converting written content into natural voice.
            Whether you're revising for exams or multitasking, LearnAudibly lets you stay productive without looking at your screen.
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
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <div className="text-blue-600 dark:text-purple-400 mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{desc}</p>
    </div>
  );
}

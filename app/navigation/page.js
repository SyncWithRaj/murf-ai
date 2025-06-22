'use client';
import Link from 'next/link';
import {
    FileAudio,
    Languages,
    UploadCloud,
    Sparkles,
    Compass,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from "@/context/ThemeContext";


const pages = [
    {
        label: 'Convert Text to Speech',
        href: '/convert',
        icon: <FileAudio size={36} />,
        desc: 'Text to Speech using Murf AI.',
    },
    {
        label: 'Translator',
        href: '/translate',
        icon: <Languages size={36} />,
        desc: 'Translate your text into multiple languages.',
    },
    {
        label: 'Extract Text from PDFs',
        href: '/extract',
        icon: <UploadCloud size={36} />,
        desc: 'Extract text from uploaded PDF files quickly.',
    },
    {
        label: 'Summarize Long Text',
        href: '/summarize',
        icon: <Sparkles size={36} />,
        desc: 'Use AI to summarize lengthy notes or articles.',
    },
];

export default function NavigationPage() {
    const { darkMode, toggleDarkMode } = useTheme();
    return (
        <div className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white px-6 pt-16">
            {/* Page Title with Icon */}
            
            <div className="flex justify-center items-center gap-3 mb-12">
                <Compass size={39} className="mb-4 text-purple-500 dark:text-purple-400" />
                <h1 className="pb-4 text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-400 drop-shadow-lg">Navigate LearnAudibly</h1>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {pages.map((page) => (
                    <Link key={page.href} href={page.href}>
                        <div className="card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-purple-400/30 p-8 transition-all cursor-pointer hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-4 text-purple-600 dark:text-purple-400">
                                {page.icon}
                                <h2 className="text-2xl font-semibold">{page.label}</h2>
                            </div>
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{page.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Add this

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Convert", href: "/convert" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "backdrop-blur-md bg-purple-900/80 shadow-md"
                : "bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900"
                } text-white font-medium`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-3xl font-extrabold tracking-tight text-white hover:text-purple-200 transition-colors duration-200"
                >
                    LearnAudibly
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6 text-sm items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative inline-block text-white transition-colors duration-300 hover:text-purple-200 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-300 after:transition-all after:duration-300 hover:after:w-full text-lg"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-2xl focus:outline-none text-white transition-transform duration-300 hover:scale-110"
                >
                    {open ? "✕" : "☰"}
                </button>

            </div>

            {/* Mobile Links */}
            {open && (
                <div className="md:hidden px-4 pb-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md border border-white/20 p-4 space-y-3 transition-all duration-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block text-white font-medium tracking-wide text-base relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-300 after:transition-all after:duration-300 hover:after:w-full hover:text-purple-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </nav>
    );
}

'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Convert", href: "/convert" },
        { label: "Translate", href: "/translate" },
        { label: "Extract", href: "/extract" },
        { label: "Summarize", href: "/summarize" },
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
                ? "backdrop-blur-md bg-[#1f1c2c]/70 shadow-xl border-b border-white/10"
                : "bg-gradient-to-r from-[#1f1c2c] via-[#302b63] to-[#24243e]"
                } text-white font-medium`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-400 hover:brightness-110 transition-all duration-300 flex gap-1 py-2"
                >
                    <Image
                        src="/logo.png"     // ✅ must start with `/` (from public)
                        alt="LearnAudibly Logo"
                        width={40}         // ✅ required
                        height={30}        // ✅ required
                        className="rounded-xl shadow-lg"  // optional styling
                    />
                    LearnAudibly
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex space-x-8 text-sm items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative px-3 py-2 rounded-lg text-white/90 hover:text-white transition duration-200 hover:bg-white/10 hover:shadow-md text-lg font-semibold"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 hover:shadow-sm transition-all duration-200"
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Links */}
            {open && (
                <div className="lg:hidden px-4 pb-4 transition-all duration-300">
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium text-base"
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

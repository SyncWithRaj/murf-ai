'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Convert", href: "/convert" },
        { label: "Translate", href: "/translate" },
        { label: "Extract", href: "/extract" },
        { label: "Dubbing", href: "/dub" },
        { label: "Summarize", href: "/summarize" },
    ];

    const linkRefs = useRef({});
    const underlineRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const activeRef = linkRefs.current[pathname];
        const underline = underlineRef.current;

        if (activeRef && underline) {
            const { offsetLeft, offsetWidth } = activeRef;
            underline.style.transform = `translateX(${offsetLeft}px)`;
            underline.style.width = `${offsetWidth}px`;
        }
    }, [pathname]);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? "backdrop-blur-md bg-[#1f1c2c]/70 shadow-xl border-b border-white/10"
            : "bg-gradient-to-r from-[#1f1c2c] via-[#302b63] to-[#24243e]"} text-white font-medium`}>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-400 hover:brightness-110 transition-all duration-300 flex gap-1 py-2">
                    <Image src="/logo.png" alt="LearnAudibly Logo" width={40} height={30} className="rounded-xl shadow-lg" />
                    LearnAudibly
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex space-x-6 text-sm items-center relative">
                    {/* Underline Slider */}
                    <span
                        ref={underlineRef}
                        className="absolute bottom-0 h-[2px] bg-pink-400 transition-all duration-300 rounded-full"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            ref={(el) => linkRefs.current[link.href] = el}
                            className={`relative px-1 py-2 text-lg font-semibold transition-all duration-300 ${
                                pathname === link.href ? "text-white" : "text-white/80 hover:text-white"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Hamburger Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-[6px] relative z-50"
                >
                    <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${open ? "rotate-45 translate-y-[8px]" : ""}`} />
                    <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
                    <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${open ? "-rotate-45 -translate-y-[8px]" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} px-4`}>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-md transition-all duration-300 font-medium text-base ${
                                pathname === link.href
                                    ? "text-white border-l-4 border-pink-400 bg-white/10"
                                    : "text-white/90 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}

'use client'
import {
  Github,
  Linkedin,
  Instagram,
  Globe,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const socials = [
  {
    href: "https://github.com/SyncWithRaj",
    label: "GitHub",
    icon: <Github size={25} />,
    hoverColor: "hover:text-purple-500",
  },
  {
    href: "https://www.linkedin.com/in/raj-ribadiya/",
    label: "LinkedIn",
    icon: <Linkedin size={25} />,
    hoverColor: "hover:text-blue-600",
  },
  {
    href: "https://www.instagram.com/ribadiya_raj/",
    label: "Instagram",
    icon: <Instagram size={25} />,
    hoverColor: "hover:text-pink-500",
  },
  {
    href: "https://x.com/ribadiya_rajj",
    label: "Twitter/X",
    icon: <Twitter size={25} />,
    hoverColor: "hover:text-sky-400",
  },
  {
    href: "https://raj-ribadiya.vercel.app",
    label: "Website",
    icon: <Globe size={25} />,
    hoverColor: "hover:text-white",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-3 md:gap-5 mb-2 px-4">
      {socials.map(({ href, label, icon, hoverColor }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`text-gray-400 transition-colors duration-200 ${hoverColor}`}
        >
          {icon}
        </Link>
      ))}
    </div>
  );
}

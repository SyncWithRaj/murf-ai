"use client";
import { useState, useEffect } from "react";
import {
  Volume2, Languages, MessageSquareText, Download,
  ClipboardCopy, VideoIcon, Sun, Moon
} from "lucide-react";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";

export default function TranslatePage() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState([]);
  const [targetLang, setTargetLang] = useState("hi-IN");
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [copiedIndexes, setCopiedIndexes] = useState([]);
    const [darkMode, setDarkMode] = useState(true);


  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text, lang) => {
    if (!window?.speechSynthesis) return toast.error("❌ Speech not supported");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const matchedVoice = voices.find((v) => v.lang === lang);
    if (matchedVoice) utterance.voice = matchedVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return toast.error("Please enter text to translate.");
    setLoading(true);
    setTranslatedText([]);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: inputText.split("\n").filter(Boolean),
          targetLanguage: targetLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");
      setTranslatedText(data.result.translations || []);
      toast.success("Translation completed!");
    } catch (err) {
      console.error("❌ Translation error:", err);
      toast.error("Failed to translate.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = (original, translated, index) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Translated Text", 14, 20);
    doc.setFontSize(12);
    doc.text("Original:", 14, 35);
    doc.text(original, 14, 45);
    doc.text("Translated:", 14, 60);
    const lines = doc.splitTextToSize(translated, 180);
    doc.text(lines, 14, 70);
    doc.save(`translation-${index + 1}.pdf`);
    toast.success("PDF downloaded!");
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied!");
      setCopiedIndexes((prev) => [...prev, idx]);
    } catch (err) {
      toast.error("Failed to copy.");
    }
  };

  return (
    <div
      className={`min-h-[89.8vh] transition-all duration-500 p-6 flex items-center justify-center 
        ${darkMode
          ? "bg-gradient-to-br from-[#1f1c2c] via-[#302b63] to-[#24243e] text-white"
          : "bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800"
        }`}
    >
      <Toaster position="top-right" />
      <div className={`rounded-3xl p-8 max-w-3xl w-full shadow-2xl transition-all duration-500 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
        <div className="flex items-center gap-2 justify-center mb-6">
          <Languages className={`w-8 h-8 ${darkMode ? "text-purple-300" : "text-blue-700"}`} />
          <h1 className={`text-4xl font-extrabold text-center ${darkMode ? "text-purple-300" : "text-blue-700"}`}>
            Translate Text
          </h1>
        </div>

        <textarea
          className={`w-full p-4 rounded-xl mb-4 resize-none border transition-all duration-300 outline-none ${darkMode
            ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500"
            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
            }`}
          rows={6}
          placeholder="Enter your text here (each line will be translated)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <select
          className={`p-3 rounded-xl outline-none w-full mb-4 transition-all duration-300 ${darkMode
            ? "bg-gray-800 border border-gray-600 text-white focus:ring-purple-500"
            : "bg-white border border-gray-300 text-gray-900 focus:ring-blue-400"
            }`}
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="hi-IN">Hindi</option>
          <option value="de-DE">German</option>
        </select>

        <button
          onClick={handleTranslate}
          disabled={loading}
          className={`transition-all duration-200 text-white px-4 py-3 rounded-xl w-full font-semibold shadow-md ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : darkMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {translatedText.length > 0 && (
          <div className="mt-8 space-y-6">
            {translatedText.map((item, idx) => (
              <div key={idx} className={`rounded-xl p-5 shadow-md border transition-all ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-400">
                  <MessageSquareText className="w-4 h-4" />
                  Original
                </div>
                <p className={`text-base mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {item.source_text}
                </p>

                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-400">
                  <Languages className="w-4 h-4" />
                  Translated
                </div>
                <p className={`text-lg font-medium mb-4 ${darkMode ? "text-purple-200" : "text-purple-700"}`}>
                  {item.translated_text}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => speak(item.translated_text, targetLang)}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read Aloud
                  </button>

                  <button
                    onClick={() => handleCopy(item.translated_text, idx)}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <ClipboardCopy className="w-4 h-4" />
                    Copy Text
                  </button>

                  <button
                    onClick={() => downloadAsPDF(item.source_text, item.translated_text, idx)}
                    className="inline-flex items-center gap-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>

                  {copiedIndexes.includes(idx) && (
                    <button
                      onClick={() => (window.location.href = "/convert")}
                      className="inline-flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <VideoIcon className="w-4 h-4" />
                      Export as MP3
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

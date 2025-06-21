"use client";
import { useState, useEffect } from "react";
import { Volume2, Languages, MessageSquareText } from "lucide-react";

export default function TranslatePage() {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState([]);
    const [targetLang, setTargetLang] = useState("es-ES");
    const [loading, setLoading] = useState(false);
    const [voices, setVoices] = useState([]);

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
        if (!window?.speechSynthesis) return alert("❌ Speech not supported");

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Find matching voice
        const matchedVoice = voices.find((v) => v.lang === lang);
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        window.speechSynthesis.cancel(); // Stop any current speech
        window.speechSynthesis.speak(utterance);
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) return alert("❌ Please enter text to translate.");

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
        } catch (err) {
            console.error("❌ Translation error:", err);
            alert("Failed to translate: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-black py-12 px-6 text-gray-800 dark:text-white">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all">
                <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-400 mb-6 text-center">
                    🌍 Translate Text
                </h1>

                <textarea
                    className="w-full px-5 py-4 text-base leading-relaxed rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 mb-6 resize-none"
                    rows={6}
                    placeholder="Enter your text here (each line will be translated)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />

                <select
                    className="w-full px-5 py-3 text-base rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition duration-300 mb-6"
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
                    className={`w-full py-3 text-lg font-semibold rounded-xl  cursor-pointer text-white transition-all ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        }`}
                >
                    {loading ? "Translating..." : "Translate"}
                </button>

                {translatedText.length > 0 && (
                    <div className="mt-10 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 transition-all">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <Languages className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            Translated Results
                        </h2>
                        <ul className="space-y-6">
                            {translatedText.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
                                >
                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        <MessageSquareText className="w-4 h-4" />
                                        Original Text
                                    </div>
                                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                                        {item.source_text}
                                    </p>

                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        <Languages className="w-4 h-4" />
                                        Translated
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-purple-200 mb-4">
                                        {item.translated_text}
                                    </p>

                                    <button
                                        onClick={() => speak(item.translated_text, targetLang)}
                                        className="inline-flex items-center gap-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition  cursor-pointer"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                        Read Aloud
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

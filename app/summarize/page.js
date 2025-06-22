"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Download, ClipboardCopy, Sun, Moon } from "lucide-react";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";

export default function SummarizePage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

  const [showRedirectButtons, setShowRedirectButtons] = useState(false);
  const router = useRouter();

  const handleSummarize = async () => {
    if (!inputText.trim()) return toast.error("Please enter text to summarize.");
    setLoading(true);
    setSummary("");
    setShowRedirectButtons(false);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Summarization failed");

      setSummary(data.summary);
      toast.success("Summarization completed!");
    } catch (err) {
      console.error("❌ Summarization Error:", err);
      toast.error("Failed to summarize.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Summary", 15, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summary, 180);
    doc.text(lines, 15, 30);
    doc.save("summary.pdf");
    toast.success("PDF downloaded!");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied to clipboard!");
      setShowRedirectButtons(true);
    } catch (err) {
      toast.error("Failed to copy summary.");
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


      <div className={`max-w-3xl w-full rounded-3xl p-8 shadow-2xl transition-all duration-500 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"}`}>
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Sparkles className="w-9 h-9 text-purple-600 dark:text-purple-400" />
          <h1 className={`text-4xl font-extrabold text-center ${darkMode ? "text-purple-300" : "text-blue-700"}`}>
            AI Text Summarizer
          </h1>
        </div>

        <textarea
          className={`w-full p-4 rounded-xl border mb-6 resize-none outline-none transition-all duration-300 
          ${darkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-yellow-500"
              : "bg-white border-gray-300 text-gray-900 focus:ring-yellow-400"
            }`}
          rows={8}
          placeholder="Paste the text you want summarized..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition-all duration-200 
          ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : darkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-8 space-y-4">
            <div className={`p-6 rounded-xl shadow-inner whitespace-pre-wrap leading-relaxed transition-all
            ${darkMode
                ? "bg-gray-800 text-yellow-100 border border-gray-700"
                : "bg-gray-50 text-gray-800 border border-gray-200"
              }`}>
              <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                Summary
              </h2>
              {summary}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadAsPDF}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-base font-semibold rounded-xl text-white shadow-md transition-all bg-green-600 hover:bg-green-700"
              >
                <Download size={18} /> PDF
              </button>

              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-base font-semibold rounded-xl text-white shadow-md transition-all bg-blue-600 hover:bg-blue-700"
              >
                <ClipboardCopy size={18} /> Copy
              </button>
            </div>

            {showRedirectButtons && (
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => router.push("/translate")}
                  className="flex-1 py-2 text-base font-semibold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition shadow-md"
                >
                  Translate This
                </button>

                <button
                  onClick={() => router.push("/convert")}
                  className="flex-1 py-2 text-base font-semibold rounded-xl text-white bg-pink-600 hover:bg-pink-700 transition shadow-md"
                >
                  Convert to Voice (MP3)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

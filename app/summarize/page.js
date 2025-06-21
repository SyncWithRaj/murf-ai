"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";

export default function SummarizePage() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black p-6 text-gray-900 dark:text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-extrabold tracking-tight">AI Text Summarizer</h1>
        </div>

        <textarea
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-yellow-500 outline-none transition-all mb-6 resize-none"
          rows={8}
          placeholder="Paste the text you want summarized..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-md"
          }`}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-8">
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner text-sm whitespace-pre-wrap leading-relaxed">
              <h2 className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-300">Summary</h2>
              {summary}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={downloadAsPDF}
                className="flex-1 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md transition-all duration-200"
              >
                📄 Download as PDF
              </button>

              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-md transition-all duration-200"
              >
                📋 Copy Summary
              </button>
            </div>

            {showRedirectButtons && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => router.push("/translate")}
                  className="flex-1 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md transition-all duration-200"
                >
                  🌐 Translate This
                </button>

                <button
                  onClick={() => router.push("/convert")}
                  className="flex-1 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md transition-all duration-200"
                >
                  🔊 Convert to Voice (MP3)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
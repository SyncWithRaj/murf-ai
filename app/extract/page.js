"use client";
import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";

export default function ExtractTextPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false); // track if copied

  const handleExtract = async () => {
    if (!pdfFile) return alert("Please select a PDF file first.");

    const formData = new FormData();
    formData.append("file", pdfFile);
    setLoading(true);

    try {
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract text");

      setPdfText(data.text);
    } catch (err) {
      console.error("❌ Error extracting text:", err);
      alert("Failed to extract text: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pdfText);
      setShowToast(true);
      setCopied(true); // show buttons permanently
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("❌ Copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black p-6 sm:p-12 text-gray-900 dark:text-white relative">
      {/* Toast */}
      {showToast && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn z-50">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Text copied successfully</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            PDF Text Extractor
          </h1>
        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="w-full mb-4 file:px-4 file:py-2 file:rounded-lg file:bg-purple-600 file:text-white file:font-semibold file:border-0 text-sm p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
        />

        <button
          onClick={handleExtract}
          disabled={loading || !pdfFile}
          className={`mb-6 w-full py-3 text-lg font-semibold rounded-xl text-white transition-all duration-200 ${
            loading || !pdfFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
          }`}
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {pdfText && (
          <>
            <div className="relative bg-gray-50 dark:bg-gray-700 px-6 rounded-xl text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto border border-gray-200 dark:border-gray-600 shadow-inner transition-all duration-300">
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg transition"
                title="Copy to clipboard"
              >
                <Copy size={14} /> Copy
              </button>
              {pdfText}
            </div>

            {copied && (
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/convert")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl transition shadow-lg"
                >
                  Go to Text-to-Speech
                </button>
                <button
                  onClick={() => (window.location.href = "/translate")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl transition shadow-lg"
                >
                  Go to Translator
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

"use client";
import { useState } from "react";
import { FileText, Copy, UploadCloud, Sun, Moon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ExtractTextPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!pdfFile) return toast.error("Please select a PDF file first.");

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
      toast.success("Text extracted successfully!");
    } catch (err) {
      console.error("❌ Error extracting text:", err);
      toast.error("Failed to extract text.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pdfText);
      toast.success("Text copied to clipboard!");
      setCopied(true);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile || droppedFile.type !== "application/pdf") {
      return toast.error("Please upload a valid PDF file.");
    }
    setPdfFile(droppedFile);
    toast.success(`PDF "${droppedFile.name}" selected.`);
  };
  const handleExtractClick = () => {
  if (!pdfFile) {
    toast.error("Please upload a PDF file first!");
    return;
  }

  handleExtract(); // your actual extract function
};

  const [darkMode, setDarkMode] = useState(true);

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
          <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className={`text-4xl font-extrabold text-center ${darkMode ? "text-purple-300" : "text-blue-700"}`}>
            PDF Text Extractor
          </h1>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed transition-all duration-300 rounded-xl p-6 text-center text-sm cursor-pointer mb-4
          ${darkMode
              ? "border-purple-400 bg-gray-700 text-white"
              : "border-purple-500 bg-purple-50 text-gray-700"
            }`}
        >
          <UploadCloud className="mx-auto mb-2 w-6 h-6 text-purple-500" />
          <p>Drag & drop your PDF here</p>
        </div>

        {/* Divider */}
        <div className={`text-center mb-4 font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          - - - - - or - - - - -
        </div>

        {/* File Picker */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className={`w-full text-sm p-2 border rounded-xl transition-all duration-300
          file:px-4 file:py-2 file:rounded-lg file:border-0 file:font-semibold 
          file:bg-purple-600 file:text-white 
          ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
        />

        {/* PDF File Preview */}
        {pdfFile && (
          <p className="mt-2 mb-4 text-sm italic truncate text-gray-400">
            Selected: <span className="font-medium">{pdfFile.name}</span>
          </p>
        )}

        <p className={`text-sm mb-4 font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Note: Only PDFs with selectable text supported. No scanned images.
        </p>

        {/* Extract Button */}
        <button
          onClick={handleExtractClick}
          className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition-all duration-200
    ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : darkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>


        {pdfText && (
          <>
            <div className={`relative px-6 py-4 mt-6 rounded-xl text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto border shadow-inner transition-all duration-300
            ${darkMode
                ? "bg-gray-800 text-gray-200 border-gray-700"
                : "bg-gray-50 text-gray-800 border-gray-200"
              }`}>
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition"
              >
                <Copy size={16} />
                Copy Text
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
                <button
                  onClick={() => (window.location.href = "/summarize")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl transition shadow-lg"
                >
                  Go to Summarizer
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

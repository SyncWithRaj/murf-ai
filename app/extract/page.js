"use client";
import { useState } from "react";
import { FileText, Copy, UploadCloud } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black p-6 sm:p-12 text-gray-900 dark:text-white relative">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            PDF Text Extractor
          </h1>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-gray-700 rounded-xl p-6 text-center text-sm text-gray-700 dark:text-white cursor-pointer mb-4"
        >
          <UploadCloud className="mx-auto mb-2 w-6 h-6 text-purple-500" />
          <p>Drag & drop your PDF here</p>
        </div>

        {/* Divider */}
        <div className="text-center mb-4 text-gray-500 dark:text-gray-400 font-medium">- - - - - or - - - - - </div>

        {/* File Picker */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="w-full file:px-4 file:py-2 file:rounded-lg file:bg-purple-600 file:text-white file:font-semibold file:border-0 text-sm p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
        />

        {/* PDF File Name Preview */}
        {pdfFile && (
          <p className="mt-2 mb-4 text-sm text-gray-600 dark:text-gray-300 italic truncate">
            Selected file: <span className="font-medium">{pdfFile.name}</span>
          </p>
        )}

        <div className="text-left my-2 text-gray-500 dark:text-gray-400 font-medium">Note: Select PDF file that contains text only, PDFs with images are not allowed</div>

        {/* Extract Button */}
        <button
          onClick={handleExtract}
          disabled={loading || !pdfFile}
          className={`mb-6 w-full py-3 text-lg font-semibold rounded-xl text-white transition-all duration-200 ${loading || !pdfFile
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
            }`}
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>

        {pdfText && (
          <>
            <div className="relative bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-xl text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto border border-gray-200 dark:border-gray-600 shadow-inner transition-all duration-300">
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition"
              >
                <Copy size={16} /> Copy Text
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

"use client";
import { useState, useEffect } from "react";
import { Video, Loader2, DownloadCloud } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const languageOptions = [
  { code: "en_US", label: "English (US & Canada)" },
  { code: "en_UK", label: "English (UK)" },
  { code: "en_IN", label: "English (India)" },
  { code: "en_SCOTT", label: "English (Scotland)" },
  { code: "en_AU", label: "English (Australia)" },
  { code: "fr_FR", label: "French" },
  { code: "de_DE", label: "German" },
  { code: "es_ES", label: "Spanish (Spain)" },
  { code: "es_MX", label: "Spanish (Mexico)" },
  { code: "it_IT", label: "Italian" },
  { code: "pt_BR", label: "Portuguese (Brazil)" },
  { code: "pl_PL", label: "Polish" },
  { code: "hi_IN", label: "Hindi" },
  { code: "ko_KR", label: "Korean" },
  { code: "ta_IN", label: "Tamil" },
  { code: "bn_IN", label: "Bengali" },
  { code: "ja_JP", label: "Japanese" },
  { code: "zh_CN", label: "Mandarin (Chinese)" },
  { code: "nl_NL", label: "Dutch" },
  { code: "fi_FI", label: "Finnish" },
  { code: "ru_RU", label: "Russian" },
  { code: "tr_TR", label: "Turkish" },
];


export default function MurfDubbingPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState([]);
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedLang, setSelectedLang] = useState(languageOptions[0].code);
  const [darkMode, setDarkMode] = useState(true);

  const handleDubbing = async () => {
    if (!videoFile) {
      toast.error("❌ Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("language", selectedLang);

    setLoading(true);
    setVideoUrl([]);
    setJobId("");
    setStatusMessage("Uploading and starting dubbing...");

    const waitToast = toast.loading("⏳ Uploading... This may take a minute. Don’t close this window.");

    try {
      const res = await fetch("/api/murfdub", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dub");

      setJobId(data.job_id);
      setStatusMessage("✅ Dubbing started...");
      toast.dismiss(waitToast);
      toast.success("🎉 Dubbing started! Please wait...");
      setChecking(true);
      setTimeout(() => checkDubStatus(data.job_id), 10000);
    } catch (err) {
      console.error("❌ Dubbing error:", err);
      toast.dismiss(waitToast);
      toast.error("Failed to start dubbing.");
      setStatusMessage("Failed to start dubbing.");
    } finally {
      setLoading(false);
    }
  };

  const checkDubStatus = async (jobId) => {
    try {
      const res = await fetch(`/api/murfdub/status?jobId=${jobId}`);
      const data = await res.json();

      if (data.download_details) {
        const urls = data.download_details
          .filter((d) => d.status === "COMPLETED" && d.locale === selectedLang)
          .map((d) => ({
            locale: d.locale,
            url: d.download_url,
          }));

        if (urls.length > 0) {
          setVideoUrl(urls);
          setStatusMessage("✅ Dubbing completed.");
          setChecking(false);
        } else {
          setTimeout(() => checkDubStatus(jobId), 10000);
        }
      } else {
        setTimeout(() => checkDubStatus(jobId), 10000);
      }
    } catch (err) {
      console.error("❌ Status fetch failed:", err);
    }
  };

  // Auto-scroll to video when it's ready
  useEffect(() => {
    if (videoUrl.length > 0) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [videoUrl]);

  return (
    <div
      className={`min-h-[89.8vh] transition-all duration-500 p-6 flex items-center justify-center 
        ${darkMode
          ? "bg-gradient-to-br from-[#1f1c2c] via-[#302b63] to-[#24243e] text-white"
          : "bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800"
        }`}
    >
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Video className="w-9 h-9 text-purple-600 dark:text-purple-400" />
          <h1 className={`text-4xl font-extrabold text-center ${darkMode ? "text-purple-300" : "text-blue-700"}`}>
            Murf Video Dubbing</h1>
        </div>

        {/* Language Dropdown */}
        <label className="block mb-2 font-medium">Target Language:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="mb-6 w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm"
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        {/* File Input */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="mb-6 w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm"
        />

        {/* Dubbing Button */}
        <button
          onClick={handleDubbing}
          disabled={loading || !videoFile}
          className={`w-full py-3 text-lg font-semibold rounded-xl text-white transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </span>
          ) : (
            "Upload & Start Dubbing"
          )}
        </button>

        {/* Job Info */}
        {jobId && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-purple-600 dark:text-purple-300">
            ✅ Job Created! <br />
            <span className="font-medium">Job ID:</span> {jobId}
          </div>
        )}

        {/* Processing Spinner */}
        {checking && (
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span>This may take a few minutes. Please don’t close the window.</span>
          </div>
        )}

        {/* Final Status Message */}
        {statusMessage && !checking && (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{statusMessage}</p>
        )}

        {/* Dubbed Video Preview */}
        {videoUrl.length > 0 && (
          <div className="mt-6 space-y-6">
            {videoUrl.map((vid) => (
              <div key={vid.locale}>
                <h2 className="text-lg font-semibold text-purple-600 mb-2">
                  Dubbed in {languageOptions.find((l) => l.code === vid.locale)?.label || vid.locale}
                </h2>
                <video controls className="w-full rounded-xl mb-3">
                  <source src={vid.url} type="video/mp4" />
                </video>
                <a
                  href={vid.url}
                  download
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition"
                >
                  <DownloadCloud className="w-4 h-4" /> Download 
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

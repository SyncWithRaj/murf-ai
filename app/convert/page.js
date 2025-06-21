"use client";
import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Download, Play, Pause } from "lucide-react";
import { FastForward, Rewind } from "lucide-react";


export default function ConvertPage() {
    const [text, setText] = useState("");
    const [voice, setVoice] = useState("en-US-natalie");
    const [style, setStyle] = useState("Promo");
    const [audioUrl, setAudioUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef(null);

    const handleConvert = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, voiceId: voice, style }),
            });

            const data = await res.json();
            if (res.ok) {
                setAudioUrl(data.audioUrl);
                setProgress(0);
                setIsPlaying(false);
            } else {
                alert("❌ Murf API failed.");
                console.error(data);
            }
        } catch (err) {
            alert("❌ Server error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }


    const handleDownload = async () => {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LearnAudibly-${voice}.wav`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            const progressValue = (audio.currentTime / audio.duration) * 100;
            setProgress(progressValue || 0);
        }
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const newTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = newTime;
        setProgress(e.target.value);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.addEventListener("ended", () => setIsPlaying(false));
        return () => {
            audio.removeEventListener("ended", () => setIsPlaying(false));
        };
    }, []);

    return (
        <div
            className={`min-h-screen transition-all duration-500 ${darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                : "bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800"
                } p-6 flex items-center justify-center`}
        >
            <div className="absolute top-4 right-6">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="bg-white dark:bg-gray-700 shadow-md rounded-full p-2 transition-all"
                >
                    {darkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
                </button>
            </div>

            <div
                className={`rounded-3xl p-8 max-w-xl w-full shadow-2xl transition-all duration-500 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"
                    }`}
            >
                <h1
                    className={`text-4xl font-extrabold text-center mb-6 ${darkMode ? "text-purple-300" : "text-blue-700"
                        }`}
                >
                    🗣️ LearnAudibly
                </h1>

                <textarea
                    className={`w-full p-4 rounded-xl mb-4 resize-none border transition-all duration-300 outline-none ${darkMode
                        ? "bg-gray-800 border-gray-600 text-white focus:ring-purple-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"
                        }`}
                    rows={6}
                    placeholder="Paste your study notes here..."
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setAudioUrl("");
                    }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                        className={`p-3 rounded-xl outline-none transition-all duration-300 ${darkMode
                            ? "bg-gray-800 border border-gray-600 text-white focus:ring-purple-500"
                            : "bg-white border border-gray-300 text-gray-900 focus:ring-blue-400"
                            }`}
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                    >
                        <option value="en-US-natalie">Natalie (US Female)</option>
                        <option value="en-US-marcus">Marcus (US Male)</option>
                        <option value="en-IN-priya">Priya (IN Female)</option>
                        <option value="en-IN-aarav">Ronnie (IN Male)</option>
                        <option value="en-UK-amber">Amber (UK Female)</option>
                        <option value="en-UK-freddie">Freddie (UK Male)</option>
                    </select>

                    <select
                        className={`p-3 rounded-xl outline-none transition-all duration-300 ${darkMode
                            ? "bg-gray-800 border border-gray-600 text-white focus:ring-purple-500"
                            : "bg-white border border-gray-300 text-gray-900 focus:ring-blue-400"
                            }`}
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                    >
                        <option value="Promo">Promo</option>
                        <option value="Conversational">Conversational</option>
                    </select>
                </div>

                <button
                    onClick={handleConvert}
                    disabled={loading || !text}
                    className={`transition-all duration-200 text-white px-4 py-3 rounded-xl w-full font-semibold shadow-md ${loading || !text
                        ? "bg-gray-400 cursor-not-allowed"
                        : darkMode
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Converting..." : "🎧 Generate Audio"}
                </button>

                {audioUrl && (
                    <div className="mt-6 p-4 rounded-xl shadow-inner bg-opacity-50">
                        {/* Hidden Native Audio */}
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onTimeUpdate={handleTimeUpdate}
                            className="hidden"
                        />

                        {/* Custom Audio Player */}
                        <div className="space-y-4 w-full">
                            {/* Hidden Native Audio */}
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleTimeUpdate}
                                className="hidden"
                            />

                            {/* Control Buttons */}
                            <div className="space-y-4 w-full">
                                {/* Control Buttons */}
                                <div className="flex justify-center items-center gap-6">
                                    <button
                                        onClick={() => {
                                            const audio = audioRef.current;
                                            if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
                                        }}
                                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-shadow shadow-md"
                                    >
                                        <Rewind size={20} />
                                    </button>

                                    <button
                                        onClick={toggleAudio}
                                        className={`p-4 rounded-full shadow-md text-white hover:scale-110 transition-all duration-200 ${darkMode
                                                ? "bg-purple-600 hover:bg-purple-700"
                                                : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    </button>

                                    <button
                                        onClick={() => {
                                            const audio = audioRef.current;
                                            if (audio) audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
                                        }}
                                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-shadow shadow-md"
                                    >
                                        <FastForward size={20} />
                                    </button>
                                </div>

                                {/* Progress + Timestamp */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono w-12 text-right text-gray-400">
                                        {formatTime(audioRef.current?.currentTime || 0)}
                                    </span>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={handleSeek}
                                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
        bg-gradient-to-r from-purple-500 to-blue-500 
        [&::-webkit-slider-thumb]:appearance-none 
        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
        [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition 
        [&::-webkit-slider-thumb]:hover:scale-125
        [&::-moz-range-thumb]:appearance-none 
        [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 
        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
        [&::-moz-range-thumb]:shadow-md`}
                                    />

                                    <span className="text-xs font-mono w-12 text-left text-gray-400">
                                        {formatTime(audioRef.current?.duration || 0)}
                                    </span>
                                </div>
                            </div>

                        </div>


                        <button
                            onClick={handleDownload}
                            className={`mt-4 w-full flex items-center justify-center gap-2 text-center py-2 rounded-lg font-semibold transition-all group ${darkMode
                                ? "bg-green-700 hover:bg-green-800 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            <Download size={18} />
                            <span className="group-hover:scale-105 transition-transform">Download Audio</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

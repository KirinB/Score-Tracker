import { MatchSummaryPoster } from "@/components/MatchSummaryPoster";
import type { RootState } from "@/stores";
import { Share2, X, Download, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as htmlToImage from "html-to-image";

const TestVoice = () => {
  // Logic Trọng tài giọng nói
  const [text, setText] = useState("Người chơi Nhân, cộng 9 điểm. Tổng 50.");
  const [rate, setRate] = useState(1.1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const viVoices = availableVoices.filter((v) => v.lang.includes("vi"));
      setVoices(viVoices);
      if (viVoices.length > 0) setSelectedVoice(viVoices[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.lang = "vi-VN";
    utterance.rate = rate;
    utterance.pitch = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  // Logic Chia sẻ & Review Poster
  const { players, history } = useSelector((state: RootState) => state.game);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePreview = async () => {
    if (players.length === 0) return;
    setIsGenerating(true);

    // Đợi 200ms để đảm bảo DOM poster ẩn đã sẵn sàng
    setTimeout(async () => {
      const node = document.getElementById("poster-to-capture");
      if (!node) {
        setIsGenerating(false);
        return;
      }

      try {
        // Chụp ảnh với độ nét cao (pixelRatio: 2)
        const dataUrl = await htmlToImage.toPng(node, {
          pixelRatio: 2,
          backgroundColor: "#0f172a",
        });
        setPreviewUrl(dataUrl);
      } catch (err) {
        console.error("Lỗi tạo ảnh preview:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 mt-10">
      <h2 className="text-xl font-black mb-4 uppercase text-emerald-400 flex items-center gap-2">
        <Volume2 className="size-5" /> Trọng tài Bida ảo
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold mb-1 opacity-60 uppercase">
            Nội dung đọc:
          </label>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm focus:border-emerald-500 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1 opacity-60 uppercase">
            Tốc độ: {rate}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            className="w-full accent-emerald-500"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </div>

        <button
          onClick={handleSpeak}
          className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          🔊 NGHE THỬ GIỌNG ĐỌC
        </button>

        <div className="h-px bg-slate-800 my-4" />

        <button
          onClick={handleGeneratePreview}
          disabled={players.length === 0 || isGenerating}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
        >
          <Share2 className="size-4" />
          {isGenerating ? "ĐANG KHỞI TẠO..." : "XEM POSTER CHIẾN THẮNG"}
        </button>
      </div>

      {/* --- MODAL REVIEW ẢNH --- */}
      {previewUrl && (
        <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <button
            onClick={() => setPreviewUrl(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="size-6" />
          </button>

          <h3 className="text-pink-400 font-black uppercase tracking-widest mb-6">
            Preview Poster
          </h3>

          <div className="relative group max-w-full">
            <img
              src={previewUrl}
              alt="Match Winner Poster"
              className="max-h-[65vh] rounded-lg shadow-[0_0_40px_rgba(236,72,153,0.2)] border border-white/10"
            />
          </div>

          <div className="flex gap-4 mt-8 w-full max-w-[320px]">
            <a
              href={previewUrl}
              download={`bida-pro-${Date.now()}.png`}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-emerald-900/40"
            >
              <Download className="size-5" /> TẢI ẢNH VỀ
            </a>
          </div>
          <p className="text-slate-500 text-[10px] mt-6 uppercase tracking-[0.2em] font-bold">
            Nhấn giữ ảnh để chia sẻ nhanh
          </p>
        </div>
      )}

      {/* Poster ẩn phục vụ việc capture */}
      <div className="fixed top-[200%] left-[200%] pointer-events-none opacity-0 invisible">
        <MatchSummaryPoster players={players} history={history} />
      </div>
    </div>
  );
};

export default TestVoice;

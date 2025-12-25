import { useState, useEffect } from "react";

const TestVoice = () => {
  const [text, setText] = useState("Người chơi Nhân, cộng 9 điểm. Tổng 50.");
  const [rate, setRate] = useState(1.1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  // Lấy danh sách giọng nói khả dụng trên thiết bị
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Lọc các giọng hỗ trợ tiếng Việt
      const viVoices = availableVoices.filter((v) => v.lang.includes("vi"));
      setVoices(viVoices);
      if (viVoices.length > 0) setSelectedVoice(viVoices[0].name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    // Hủy các câu đang đọc dở
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Tìm và gán giọng đã chọn
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.lang = "vi-VN";
    utterance.rate = rate; // Tốc độ đọc
    utterance.pitch = 0.7; // Độ cao giọng

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 mt-10">
      <h2 className="text-xl font-black mb-4 uppercase text-emerald-400">
        Trọng tài Bida ảo
      </h2>

      <div className="space-y-4">
        {/* Input văn bản test */}
        <div>
          <label className="block text-xs font-bold mb-1 opacity-60">
            Nội dung đọc:
          </label>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm focus:border-emerald-500 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
        </div>

        {/* Chọn giọng nói */}
        {/* <div>
          <label className="block text-xs font-bold mb-1 opacity-60">
            Chọn giọng (Vietnamese):
          </label>
          <select
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices.length > 0 ? (
              voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))
            ) : (
              <option>Đang tải giọng nói...</option>
            )}
          </select>
        </div> */}

        {/* Chỉnh tốc độ */}
        <div>
          <label className="block text-xs font-bold mb-1 opacity-60">
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

        {/* Nút bấm Test */}
        <button
          onClick={handleSpeak}
          className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-lg transition-colors shadow-lg active:scale-95"
        >
          🔊 NGHE THỬ NGAY
        </button>

        <p className="text-[10px] text-slate-500 text-center italic">
          *Lưu ý: Trên iPhone/Android, bạn cần bấm nút thì âm thanh mới phát lần
          đầu được.
        </p>
      </div>
    </div>
  );
};

export default TestVoice;

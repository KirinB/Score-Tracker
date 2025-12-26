// src/utils/voiceUtils.ts
import { store } from "@/stores"; // Import store để lấy state trực tiếp

export const playVoice = (text: string, rate: number = 1.1) => {
  // 1. Lấy trạng thái âm thanh và giao diện từ Redux
  const state = store.getState();
  const { soundEnabled, isMinimal } = state.theme;

  // 2. Kiểm tra điều kiện: Nếu tắt âm hoặc đang ở chế độ Minimal thì không đọc
  if (!soundEnabled || isMinimal) {
    console.log("Voice: Bị chặn do cài đặt (Sound Off hoặc Minimal Mode On)");
    return;
  }

  // 3. Kiểm tra trình duyệt hỗ trợ
  if (!window.speechSynthesis) {
    console.error("Trình duyệt không hỗ trợ Speech Synthesis");
    return;
  }

  // 4. Hủy các câu đang đọc dở để đọc câu mới ngay lập tức
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // 5. Tìm giọng Tiếng Việt
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(
    (v) => v.lang.includes("vi-VN") || v.lang.includes("vi")
  );

  if (viVoice) utterance.voice = viVoice;

  utterance.lang = "vi-VN";
  utterance.rate = rate;
  utterance.pitch = 0.8; // Độ cao trầm ấm vừa phải

  window.speechSynthesis.speak(utterance);
};

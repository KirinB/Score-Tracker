import { type HistoryEntry } from "@/stores/slices/game.slice";

export const getAchievements = (history: HistoryEntry[]) => {
  const bi9Map: Record<number, number> = {};
  let maxSingleTurnScore = 0;
  let maxTurnPlayerId = 0;

  // Nếu chưa có lịch sử, trả về object trống ngay
  if (history.length === 0)
    return { topBi9Id: 0, maxTurnId: 0, topBi9Count: 0, maxTurnScore: 0 };

  history.forEach((h) => {
    // 1. Tính tổng bi 9 người này đã ăn được
    const bi9Event = h.events.find((e) => e.bi === 9);
    if (bi9Event) {
      // Số bi 9 x số người bị ăn
      const count = bi9Event.count * h.loserIds.length;
      bi9Map[h.currentPlayerId] = (bi9Map[h.currentPlayerId] || 0) + count;
    }

    // 2. Tìm lượt cơ (1 lần bấm nút Lưu) có tổng điểm cao nhất
    const turnScore = h.pointPerLoser * h.loserIds.length;
    if (turnScore > maxSingleTurnScore) {
      maxSingleTurnScore = turnScore;
      maxTurnPlayerId = h.currentPlayerId;
    }
  });

  // Tìm ID người ăn nhiều bi 9 nhất
  let topBi9PlayerId = 0;
  let maxBi9 = 0;

  Object.entries(bi9Map).forEach(([id, count]) => {
    if (count > maxBi9) {
      maxBi9 = count;
      topBi9PlayerId = Number(id);
    }
  });

  return {
    topBi9Id: topBi9PlayerId,
    topBi9Count: maxBi9,
    maxTurnId: maxTurnPlayerId,
    maxTurnScore: maxSingleTurnScore,
  };
};

import { type Player, type HistoryEntry } from "@/stores/slices/game.slice";
import { Flame, Target } from "lucide-react";

interface Props {
  players: Player[];
  history: HistoryEntry[];
}

export const MatchSummaryPoster = ({ players, history }: Props) => {
  // Tìm người có điểm cao nhất
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // Tính toán danh hiệu từ history cho winner
  const topBi9Count = history
    .filter((h) => h.currentPlayerId === winner?.id)
    .reduce(
      (sum, h) => sum + (h.events.find((e) => e.bi === 9)?.count || 0),
      0
    );

  const maxTurnScore = Math.max(
    ...history
      .filter((h) => h.currentPlayerId === winner?.id)
      .map((h) => h.pointPerLoser * h.loserIds.length),
    0
  );

  return (
    <div
      id="poster-to-capture"
      className="w-95 p-6 bg-[#0f172a] text-white flex flex-col items-center gap-4 border border-slate-800"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* Tiêu đề phong cách Neon */}
      <h2 className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500 uppercase">
        Match Complete
      </h2>

      {/* Khung Winner - Neon rực rỡ */}
      <div className="w-full relative p-0.5 rounded-2xl bg-linear-to-br from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
        <div className="bg-[#1e1b4b] rounded-[14px] p-5 flex flex-col items-center text-center">
          <span className="text-[10px] font-bold text-pink-400 tracking-[0.3em] uppercase mb-1">
            Champion
          </span>
          <h1 className="text-3xl font-black text-white uppercase leading-none mb-2">
            {winner?.name || "No Name"}
          </h1>

          <div className="flex gap-2 mb-3">
            {topBi9Count > 0 && (
              <div className="flex items-center gap-1 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30 text-[9px] text-pink-300 font-bold">
                <Target className="size-3" /> VUA BI 9: {topBi9Count}
              </div>
            )}
            {maxTurnScore > 0 && (
              <div className="flex items-center gap-1 bg-violet-500/20 px-2 py-0.5 rounded-full border border-violet-500/30 text-[9px] text-violet-300 font-bold">
                <Flame className="size-3" /> CƠ ĐIÊN: +{maxTurnScore}
              </div>
            )}
          </div>

          <div className="text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] tabular-nums">
            {winner?.score ?? 0}
          </div>
        </div>
      </div>

      {/* Grid người chơi khác - Neon Cyan */}
      <div className="w-full grid grid-cols-2 gap-3">
        {sortedPlayers.slice(1).map((p) => (
          <div
            key={p.id}
            className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex flex-col items-center justify-center"
          >
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-full text-center">
              {p.name}
            </span>
            <span className="text-2xl font-black text-cyan-400 tabular-nums">
              {p.score > 0 ? `+${p.score}` : p.score}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase border-t border-slate-800 w-full pt-4 text-center">
        Bida Score Pro • {new Date().toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
};

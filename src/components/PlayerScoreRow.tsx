import { useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";
import imgCue from "@/assets/cue.png";

interface PlayerScoreRowProps {
  name: string;
  score?: number;
  active?: boolean;
  showCue?: boolean;
  onClick?: () => void;
  size?: "default" | "sm";
}

export function PlayerScoreRow({
  name,
  score,
  active,
  size = "default",
  showCue,
  onClick,
}: PlayerScoreRowProps) {
  const { isMinimal } = useSelector((state: RootState) => state.theme);
  const isNameOnly = score === undefined && !showCue;

  // --- STYLE ĐƠN GIẢN (MINIMAL) ---
  if (isMinimal) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded border transition-all mb-1 cursor-pointer",
          active
            ? "border-blue-500 bg-blue-50 dark:bg-slate-800 font-bold"
            : "border-gray-200 dark:border-gray-700",
          isNameOnly && "justify-center py-2.5",
          size === "sm" && "py-1.5 text-xs"
        )}
      >
        <div className="flex items-center gap-2">
          {name} {showCue && <img src={imgCue} className="w-4 h-4" />}
        </div>
        {score !== undefined && (
          <span className={score < 0 ? "text-red-500" : ""}>{score} điểm</span>
        )}
      </div>
    );
  }

  // --- STYLE BÀN BIDA (DEFAULT) ---
  return (
    <div className={cn("mb-1.5 px-1 w-full")}>
      <div
        onClick={onClick}
        className="relative p-[3px] rounded-lg transition-transform active:scale-[0.97] shadow-lg"
        style={{ backgroundColor: "#5d3a1a" }}
      >
        <div className="absolute top-0 left-0 size-3 bg-[#121212] rounded-br-full z-10 border-b border-black/30" />
        <div className="absolute top-0 right-0 size-3 bg-[#121212] rounded-bl-full z-10 border-b border-black/30" />
        <div className="absolute bottom-0 left-0 size-3 bg-[#121212] rounded-tr-full z-10 border-t border-black/30" />
        <div className="absolute bottom-0 right-0 size-3 bg-[#121212] rounded-tl-full z-10 border-t border-black/30" />

        <div
          className={cn(
            "relative w-full flex items-center px-4 overflow-hidden rounded-sm h-11 transition-all",
            size === "sm" && "h-9",
            active
              ? "bg-gradient-to-r from-[#2f6b55] to-[#1a3d32] text-white"
              : "bg-gradient-to-r from-slate-600 to-slate-700 text-slate-100",
            isNameOnly ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase">{name}</span>
            {showCue && <img src={imgCue} className="size-4 rotate-45" />}
          </div>
          {score !== undefined && (
            <div
              className={cn(
                "font-black text-base tabular-nums",
                score < 0
                  ? "text-red-500"
                  : active
                  ? "text-[#f2c94c]"
                  : "text-yellow-400"
              )}
            >
              {score} điểm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

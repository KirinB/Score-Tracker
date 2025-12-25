import type { RootState } from "@/stores";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  applyPenalty,
  resetAll,
  setCurrentPlayer,
  undo,
} from "@/stores/slices/game.slice";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import ScoreHistory from "./ScoreHistory";

import imgBi3 from "@/assets/bi3.png";
import imgBi6 from "@/assets/bi6.png";
import imgBi9 from "@/assets/bi9.png";
import { Undo2 } from "lucide-react";
import { PlayerScoreRow } from "@/components/PlayerScoreRow";
import { cn } from "@/lib/utils";
import { getAchievements } from "@/lib/achievements";

export type BiKey = 3 | 6 | 9;
const BI_KEYS: readonly BiKey[] = [3, 6, 9] as const;

const biImages: Record<BiKey, string> = {
  3: imgBi3,
  6: imgBi6,
  9: imgBi9,
};

const ScoreBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { players, currentPlayerId, history } = useSelector(
    (state: RootState) => state.game
  );
  const { isMinimal } = useSelector((state: RootState) => state.theme);

  const [biCounts, setBiCounts] = useState<Record<BiKey, number>>({
    3: 0,
    6: 0,
    9: 0,
  });
  const [loserIds, setLoserIds] = useState<number[]>([]);

  const achievements = useMemo(() => getAchievements(history), [history]);

  const toggleLoser = (id: number) => {
    setLoserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const changeBiCount = (bi: BiKey, delta: 1 | -1) => {
    setBiCounts((prev) => ({ ...prev, [bi]: Math.max(0, prev[bi] + delta) }));
  };

  const resetSelection = () => {
    setLoserIds([]);
    setBiCounts({ 3: 0, 6: 0, 9: 0 });
  };

  const handleApply = () => {
    const events = BI_KEYS.filter((bi) => biCounts[bi] > 0).map((bi) => ({
      bi,
      count: biCounts[bi],
    }));
    if (loserIds.length === 0) return toast.error("Chưa chọn người bị đền");
    if (events.length === 0) return toast.error("Chưa chọn bi");

    dispatch(applyPenalty({ loserIds, events }));
    toast.success("Đã ghi điểm");
    resetSelection();
  };

  return (
    <div
      className={cn(
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] px-2 md:w-112.5 md:mx-auto flex flex-col overflow-hidden transition-colors duration-300",
        isMinimal ? "bg-slate-50 dark:bg-slate-950" : "bg-[#07120e]"
      )}
    >
      <div
        className={cn(
          "flex-1 flex flex-col rounded-[24px] overflow-hidden mb-2 transition-all duration-500",
          isMinimal
            ? "mt-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            : "mt-2 border-2 border-[#2a4d40] bg-linear-to-b from-[#1a3d32] to-[#0d211a] shadow-2xl"
        )}
      >
        {/* HEADER */}
        <div
          className={cn(
            "flex flex-row justify-between items-center px-4 py-3 border-b",
            isMinimal
              ? "border-slate-100 dark:border-slate-800"
              : "bg-black/20 border-white/5"
          )}
        >
          <h2
            className={cn(
              "font-bold flex items-center gap-2",
              isMinimal ? "text-slate-800 dark:text-slate-100" : "text-white"
            )}
          >
            <span>🎱</span> Tính điểm
          </h2>
          <ScoreHistory />
        </div>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* BẢNG ĐIỂM */}
          <div className="space-y-0.5">
            {players.map((p) => (
              <PlayerScoreRow
                key={p.id}
                name={p.name}
                score={p.score}
                active={p.id === currentPlayerId}
                showCue={p.id === currentPlayerId}
                id={p.id}
                achievements={achievements}
                onClick={() => dispatch(setCurrentPlayer(p.id))}
              />
            ))}
          </div>

          {/* CHỌN BI */}
          <div className="space-y-1.5">
            <Label
              className={
                isMinimal
                  ? "text-slate-500 text-[10px] font-bold uppercase ml-1"
                  : "text-[#a8c5bb] text-[10px] uppercase font-bold tracking-wider ml-1"
              }
            >
              Mức bi
            </Label>
            <div className="grid grid-cols-1 gap-1.5">
              {BI_KEYS.map((bi) => (
                <div
                  key={bi}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl transition-all",
                    isMinimal
                      ? "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                      : "bg-black/20 border border-white/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={biImages[bi]}
                      className="w-6 h-6"
                      alt={`bi ${bi}`}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isMinimal
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-white"
                      )}
                    >
                      Bi {bi}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => changeBiCount(bi, -1)}
                      disabled={biCounts[bi] === 0}
                    >
                      −
                    </Button>
                    <span
                      className={cn(
                        "w-4 text-center font-bold",
                        isMinimal
                          ? "text-slate-900 dark:text-slate-50"
                          : "text-[#f2c94c]"
                      )}
                    >
                      {biCounts[bi]}
                    </span>
                    <Button
                      variant={isMinimal ? "default" : "success"}
                      size="icon"
                      className="size-8"
                      onClick={() => changeBiCount(bi, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NGƯỜI BỊ ĐỀN */}
          <div className="space-y-1">
            <Label
              className={
                isMinimal
                  ? "text-slate-500 text-[10px] font-bold uppercase ml-1"
                  : "text-[#a8c5bb] text-[9px] uppercase font-black tracking-[0.2em] ml-1 opacity-70"
              }
            >
              Người bị đền
            </Label>
            <div className="grid grid-cols-1 gap-0">
              {players
                .filter((p) => p.id !== currentPlayerId)
                .map((p) => (
                  <PlayerScoreRow
                    key={p.id}
                    name={p.name}
                    active={loserIds.includes(p.id)}
                    onClick={() => toggleLoser(p.id)}
                  />
                ))}
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-auto pt-2 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-12 w-12 shrink-0 rounded-xl transition-colors",
                isMinimal
                  ? "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  : "bg-white/5 border-white/10 text-white"
              )}
              disabled={history.length === 0}
              onClick={() => {
                dispatch(undo());
                toast.success("Hoàn tác");
              }}
            >
              <Undo2 className="h-5 w-5" />
            </Button>

            <Button
              className="flex-1 h-12 text-base font-black uppercase tracking-wider rounded-xl shadow-lg"
              onClick={handleApply}
            >
              Ghi điểm
            </Button>
          </div>
          {/* RESET */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-10 text-xs font-bold uppercase opacity-80 rounded-xl"
              >
                Làm mới trận đấu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={cn(
                "rounded-[24px] border-none",
                isMinimal
                  ? "bg-white dark:bg-slate-900"
                  : "bg-[#1a3d32] text-white"
              )}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Reset điểm số?</AlertDialogTitle>
                <AlertDialogDescription
                  className={isMinimal ? "" : "text-gray-300"}
                >
                  Toàn bộ dữ liệu sẽ bị xóa trắng.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-2">
                <AlertDialogCancel className="flex-1 rounded-xl mt-0">
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  onClick={() => dispatch(resetAll())}
                >
                  Đồng ý
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

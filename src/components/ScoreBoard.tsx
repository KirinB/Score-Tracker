import type { RootState } from "@/stores";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  applyPenalty,
  resetAll,
  setCurrentPlayer,
  undo,
} from "@/stores/slices/game.slice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import imgCue from "@/assets/cue.png";
import { Undo2 } from "lucide-react";

/* ================= TYPES ================= */

export type BiKey = 3 | 6 | 9;

/** QUAN TRỌNG: dùng const array thay cho Object.keys */
const BI_KEYS: readonly BiKey[] = [3, 6, 9] as const;

const biImages: Record<BiKey, string> = {
  3: imgBi3,
  6: imgBi6,
  9: imgBi9,
};

/* ================= COMPONENT ================= */

const ScoreBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { players, currentPlayerId, history } = useSelector(
    (state: RootState) => state.game
  );

  /** mỗi bi có count riêng */
  const [biCounts, setBiCounts] = useState<Record<BiKey, number>>({
    3: 0,
    6: 0,
    9: 0,
  });

  const [loserIds, setLoserIds] = useState<number[]>([]);

  /* ---------- helpers ---------- */

  const toggleLoser = (id: number) => {
    setLoserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const changeBiCount = (bi: BiKey, delta: 1 | -1) => {
    setBiCounts((prev) => ({
      ...prev,
      [bi]: Math.max(0, prev[bi] + delta),
    }));
  };

  const resetSelection = () => {
    setLoserIds([]);
    setBiCounts({ 3: 0, 6: 0, 9: 0 });
  };

  /* ---------- submit ---------- */

  const handleApply = () => {
    const events = BI_KEYS.filter((bi) => biCounts[bi] > 0).map((bi) => ({
      bi,
      count: biCounts[bi],
    }));

    if (loserIds.length === 0) {
      toast.error("Chưa chọn người bị đền");
      return;
    }

    if (events.length === 0) {
      toast.error("Chưa chọn bi");
      return;
    }

    dispatch(
      applyPenalty({
        loserIds,
        events,
      })
    );

    toast.success("Đã ghi điểm");
    resetSelection();
  };

  /* ---------- render ---------- */

  return (
    <div className="pt-[env(safe-area-inset-top)] px-2 md:w-2/3 md:mx-auto">
      <Card className="mt-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>🎱 Tính điểm đền</CardTitle>
          <ScoreHistory />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ===== BẢNG ĐIỂM ===== */}
          {players.map((p) => (
            <div
              key={p.id}
              onClick={() => dispatch(setCurrentPlayer(p.id))}
              className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer
                ${
                  p.id === currentPlayerId
                    ? "border-2 border-blue-500 bg-blue-50 dark:bg-slate-600 font-bold"
                    : "border"
                }`}
            >
              <div className="flex items-center gap-2">
                {p.name}
                {p.id === currentPlayerId && (
                  <img src={imgCue} className="w-5 h-5" />
                )}
              </div>
              <span>{p.score} điểm</span>
            </div>
          ))}

          {/* ===== CHỌN BI ===== */}
          <div className="space-y-2">
            <Label>Mức bi</Label>

            {BI_KEYS.map((bi) => (
              <div
                key={bi}
                className="flex items-center justify-between border rounded p-2"
              >
                <div className="flex items-center gap-2">
                  <img src={biImages[bi]} className="w-5 h-5" />
                  <span>Bi {bi}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => changeBiCount(bi, -1)}
                    disabled={biCounts[bi] === 0} // <-- disable khi count = 0
                  >
                    −
                  </Button>

                  <span className="w-6 text-center">{biCounts[bi]}</span>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => changeBiCount(bi, 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ===== NGƯỜI BỊ ĐỀN ===== */}
          <div className="space-y-1">
            <Label>Người bị đền</Label>

            {players
              .filter((p) => p.id !== currentPlayerId)
              .map((p) => (
                <Button
                  key={p.id}
                  variant={loserIds.includes(p.id) ? "default" : "outline"}
                  onClick={() => toggleLoser(p.id)}
                  className="w-full"
                >
                  {p.name}
                </Button>
              ))}
          </div>

          {/* ===== ACTION ===== */}
          <div className="flex gap-2">
            <Button
              className="flex-1 flex gap-2 items-center justify-center"
              variant="outline"
              disabled={history.length === 0}
              onClick={() => {
                dispatch(undo());
                toast.success("Hoàn tác");
              }}
            >
              <Undo2 />
              <p>Hoàn tác</p>
            </Button>

            <Button
              className="flex-1"
              onClick={handleApply}
              variant={"success"}
            >
              Ghi điểm
            </Button>
          </div>

          {/* ===== RESET ===== */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Reset
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Toàn bộ dữ liệu sẽ bị xoá và không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white"
                  onClick={() => dispatch(resetAll())}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreBoard;

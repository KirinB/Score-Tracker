import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/stores";
import {
  applyPenalty,
  resetAll,
  undo,
  setCurrentPlayer,
} from "@/stores/slices/game.slice";
import imgCue from "@/assets/cue.png";
import imgBi3 from "@/assets/bi3.png";
import imgBi6 from "@/assets/bi6.png";
import imgBi9 from "@/assets/bi9.png";
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
} from "./ui/alert-dialog";
import { toast } from "sonner";

const ScoreBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { players, currentPlayerId, history, penaltyPoints } = useSelector(
    (state: RootState) => state.game
  );

  const [selectedBi, setSelectedBi] = useState<number[]>([]);
  const [selectedLosers, setSelectedLosers] = useState<number[]>([]);

  // Toggle chọn bi 3,6,9
  const toggleBi = (val: number) => {
    if (selectedBi.includes(val)) {
      setSelectedBi(selectedBi.filter((b) => b !== val));
    } else {
      setSelectedBi([...selectedBi, val]);
    }
  };

  // Toggle chọn người bị đền
  const toggleLoser = (id: number) => {
    if (selectedLosers.includes(id)) {
      setSelectedLosers(selectedLosers.filter((l) => l !== id));
    } else {
      setSelectedLosers([...selectedLosers, id]);
    }
  };

  // Áp dụng penalty
  const handleApply = () => {
    if (selectedLosers.length === 0) {
      toast.error("Vui lòng chọn người bị đền");
      return;
    }
    if (selectedBi.length === 0) {
      toast.error("Vui lòng chọn mức bi (3,6,9)");
      return;
    }
    dispatch(
      applyPenalty({ loserIds: selectedLosers, penaltyKeys: selectedBi })
    );
    toast.success("Ghi điểm thành công", {
      description: `Bi: ${selectedBi.join(", ")} | Người đền: ${selectedLosers
        .map((id) => players.find((p) => p.id === id)?.name)
        .join(", ")}`,
    });
    setSelectedBi([]);
    setSelectedLosers([]);
  };

  return (
    <div className="pt-[env(safe-area-inset-top)] px-2 md:w-2/3 md:mx-auto">
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>🎱 Tính điểm đền</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bảng điểm */}
          {players.map((p) => (
            <div
              key={p.id}
              className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer
                  ${
                    p.id === currentPlayerId
                      ? "border-2 border-blue-500 bg-blue-50 font-bold"
                      : "border"
                  }
                  `}
              onClick={() => dispatch(setCurrentPlayer(p.id))}
            >
              <div className="flex items-center space-x-2">
                <span>{p.name}</span>
                {p.id === currentPlayerId && (
                  <img src={imgCue} alt="Cue" className="w-5 h-5" />
                )}
              </div>
              <span>{p.score}</span>
            </div>
          ))}

          {/* Chọn mức bi */}
          <div className="space-y-1">
            <Label>Mức bi</Label>
            <div className="flex space-x-2">
              {penaltyPoints.map((p) => {
                let imgSrc;
                if (p.key === 3) imgSrc = imgBi3;
                else if (p.key === 6) imgSrc = imgBi6;
                else if (p.key === 9) imgSrc = imgBi9;

                return (
                  <Button
                    key={p.key}
                    variant={selectedBi.includes(p.key) ? "default" : "outline"}
                    onClick={() => toggleBi(p.key)}
                    className="flex-1 flex items-center justify-center space-x-1"
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={`Bi ${p.key}`}
                        className="w-5 h-5"
                      />
                    )}
                    <span>{p.key}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Chọn người bị đền */}
          <div className="space-y-1">
            <Label>Người bị đền</Label>
            <div className="flex flex-col space-y-1">
              {players
                .filter((p) => p.id !== currentPlayerId)
                .map((p) => (
                  <Button
                    key={p.id}
                    variant={
                      selectedLosers.includes(p.id) ? "default" : "outline"
                    }
                    onClick={() => toggleLoser(p.id)}
                  >
                    {p.name}
                  </Button>
                ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                toast.success("Hoàn tác thành công");
                dispatch(undo());
              }}
              disabled={history.length === 0}
            >
              Undo
            </Button>
            <Button
              className="flex-1"
              onClick={handleApply}
              variant={"success"}
            >
              Ghi điểm
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full mt-2" variant="destructive">
                Reset
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ xoá toàn bộ điểm số và danh sách người chơi.
                  Dữ liệu không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
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

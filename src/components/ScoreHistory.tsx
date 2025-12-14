import type { RootState } from "@/stores";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { TrashIcon, HistoryIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { undoToIndex } from "@/stores/slices/game.slice";

const PAGE_SIZE = 5; // số lượt mỗi trang

const ScoreHistory: React.FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const gameState = useSelector((state: RootState) => state.game);

  if (
    !gameState ||
    !Array.isArray(gameState.players) ||
    !Array.isArray(gameState.history)
  ) {
    localStorage.removeItem("9bi_game_state");
    return (
      <div className="p-4 text-red-600 font-bold">
        App đã được cập nhật. Vui lòng reload trang để bắt đầu lại.
      </div>
    );
  }

  const { players, history } = gameState;

  // Đảo ngược mảng để lượt mới nhất lên đầu
  const reversedHistory = [...history].reverse();
  const totalPages = Math.ceil(reversedHistory.length / PAGE_SIZE);
  const pageHistory = reversedHistory.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const handleDelete = (index: number) => {
    const originalIndex = history.length - 1 - index; // map lại index gốc trong history
    const entry = history[originalIndex];
    if (!entry || !Array.isArray(entry.loserIds)) return;

    const winnerName =
      players.find((p) => p.id === entry.currentPlayerId)?.name ?? "??";
    const loserNames = entry.loserIds
      .map((id) => players.find((p) => p.id === id)?.name ?? "??")
      .join(", ");

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa lượt này?\nNgười được điểm: ${winnerName}\nNgười mất điểm: ${loserNames}`
      )
    ) {
      dispatch(undoToIndex(originalIndex));
      toast.success("Đã xóa lượt ghi điểm");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HistoryIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Lịch sử điểm</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
          {history.length === 0 && <p>Chưa có lượt nào.</p>}

          {pageHistory.map((h, i) => {
            if (!h || !Array.isArray(h.loserIds)) return null;

            const losers =
              players.find((p) => p.id === h.currentPlayerId)?.name ?? "??";
            const winner = h.loserIds
              .map((id) => players.find((p) => p.id === id)?.name ?? "??")
              .join(", ");

            return (
              <div
                key={i + page * PAGE_SIZE}
                className="flex justify-between items-center border p-2 rounded"
              >
                <p>
                  #{history.length - (page * PAGE_SIZE + i)}:{" "}
                  <strong>{winner}</strong> đền <strong>{losers}</strong>{" "}
                  {h.totalPoints} điểm
                </p>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(i + page * PAGE_SIZE)}
                >
                  <TrashIcon />
                </Button>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              {"<"} Trước
            </Button>
            <span className="flex items-center gap-1">
              {page + 1}/{totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Tiếp {">"}
            </Button>
          </div>
        )}

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreHistory;

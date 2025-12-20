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
import { renderEventText } from "@/lib/helper";

const PAGE_SIZE = 5;

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

  const totalPages = Math.ceil(history.length / PAGE_SIZE);

  const sortedHistory = [...history].sort((a, b) => b.createdAt - a.createdAt);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageHistory = sortedHistory.slice(start, end);

  const handleDelete = (index: number) => {
    const entry = pageHistory[index];
    if (!entry) return;

    const originalIndex = history.findIndex((h) => h.id === entry.id);
    if (originalIndex === -1) return;

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
            const losers =
              players.find((p) => p.id === h.currentPlayerId)?.name ?? "??";
            const winner = h.loserIds
              .map((id) => players.find((p) => p.id === id)?.name ?? "??")
              .join(", ");

            const number = sortedHistory.length - (page * PAGE_SIZE + i);

            return (
              <div
                key={h.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <p className="text-sm leading-relaxed">
                  #{number}: <strong>{winner}</strong> đền{" "}
                  <strong>{losers}</strong>{" "}
                  <span className="text-muted-foreground">
                    ({renderEventText(h.events)})
                  </span>
                </p>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(i)}
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
            <span>
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

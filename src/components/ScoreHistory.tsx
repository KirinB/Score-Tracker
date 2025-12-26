import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrashIcon,
  HistoryIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { toast } from "sonner";
import { undoToIndex } from "@/stores/slices/game.slice";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";
import { MESSAGES } from "@/const/message";

const PAGE_SIZE = 5;

const BiBadge = ({ bi, count }: { bi: number; count: number }) => {
  const colors: Record<number, string> = {
    3: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    6: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    9: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)] text-black",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-black text-white ml-1 first:ml-0",
        colors[bi]
      )}
    >
      Bi {bi} × {count}
    </span>
  );
};

const ScoreHistory: React.FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { players, history } = useSelector((state: RootState) => state.game);
  const { isMinimal } = useSelector((state: RootState) => state.theme);

  const sortedHistory = [...history].sort((a, b) => b.createdAt - a.createdAt);
  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const pageHistory = sortedHistory.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  const handleDelete = (id: string) => {
    const originalIndex = history.findIndex((h) => h.id === id);
    if (originalIndex === -1) return;
    if (window.confirm(MESSAGES.SCORE_UNDO_CONFIRM)) {
      dispatch(undoToIndex(originalIndex));
      toast.success(MESSAGES.SCORE_UNDO);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl">
          <HistoryIcon className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col">
        {/* HEADER */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <HistoryIcon className="size-5 opacity-50" /> Lịch sử điểm
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT AREA */}
        <div className="px-6 py-2 space-y-3 max-h-[50vh] overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-2 opacity-30">
              <HistoryIcon className="size-10" />
              <p className="text-sm font-medium">Chưa có lượt ghi điểm nào</p>
            </div>
          ) : (
            pageHistory.map((h, i) => {
              const winner =
                players.find((p) => p.id === h.currentPlayerId)?.name ?? "??";
              const losers = h.loserIds
                .map((id) => players.find((p) => p.id === id)?.name ?? "??")
                .join(", ");
              const displayIndex = history.length - (page * PAGE_SIZE + i);

              // Tổng điểm nhận được = (điểm mỗi người thua) * (số người thua)
              const totalGain = h.pointPerLoser * h.loserIds.length;

              return (
                <div
                  key={h.id}
                  className={cn(
                    "flex justify-between items-center p-3 rounded-[18px] transition-all",
                    isMinimal
                      ? "bg-slate-50 border border-slate-100 dark:bg-slate-800"
                      : "bg-white/5 border border-white/5"
                  )}
                >
                  <div className="flex-1 space-y-1">
                    {/* Dòng 1: Ai ăn ai */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold opacity-30">
                        #{displayIndex}
                      </span>
                      <span className="font-bold text-sm text-emerald-400">
                        {winner}
                      </span>
                      <span className="text-[10px] opacity-50 uppercase font-bold">
                        ăn
                      </span>
                      <span className="font-medium text-sm">{losers}</span>
                    </div>

                    {/* Dòng 2: Danh sách bi và Tổng điểm */}
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-1">
                        {h.events.map((ev, idx) => {
                          // Lấy số lượng thực tế nhân với số người thua
                          const displayCount = ev.count * h.loserIds.length;
                          return (
                            <BiBadge
                              key={idx}
                              bi={ev.bi}
                              count={displayCount}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-bold text-yellow-500 ml-1">
                        (+{totalGain})
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:bg-red-500/10 shrink-0"
                    onClick={() => handleDelete(h.id)}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER CỐ ĐỊNH */}
        <DialogFooter
          className={cn(
            "p-4 mt-0 sm:justify-between items-center border-t gap-4",
            isMinimal
              ? "bg-slate-50/50 border-slate-100"
              : "bg-black/20 border-white/5"
          )}
        >
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-lg"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </>
            )}
          </div>

          <DialogClose asChild>
            <Button
              variant={isMinimal ? "secondary" : "ghost"}
              className={cn(
                "rounded-xl font-bold uppercase text-[10px] tracking-widest h-9 px-6 w-full",
                !isMinimal && "bg-white/5 hover:bg-white/10 text-white"
              )}
            >
              Đóng lại
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreHistory;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { RootState } from "@/stores";

import {
  setPlayers,
  setPenaltyPoints,
  type Player,
  type PenaltyPoint,
} from "@/stores/slices/game.slice";

import { toast } from "sonner";
import { Users, Settings2, PlayCircle } from "lucide-react";

const defaultPenaltyPoints: PenaltyPoint[] = [
  { key: 3, value: 1 },
  { key: 6, value: 2 },
  { key: 9, value: 3 },
];

const PlayerFormSchema = z
  .object({
    playerCount: z.enum(["3", "4"]),
    names: z.array(z.string()),
    penaltyPoints: z.array(
      z.object({
        key: z.union([z.literal(3), z.literal(6), z.literal(9)]),
        value: z.number().min(0, "Điểm phải >=0"),
      })
    ),
  })
  .superRefine((data, ctx) => {
    const count = Number(data.playerCount);
    data.names.slice(0, count).forEach((name, i) => {
      if (name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên ít nhất 2 ký tự",
          path: ["names", i],
        });
      }
    });
  });

type FormValues = z.infer<typeof PlayerFormSchema>;

const PlayerForm: React.FC = () => {
  const dispatch = useDispatch();
  const { isMinimal } = useSelector((state: RootState) => state.theme);
  const [playerCount, setPlayerCount] = useState<3 | 4>(3);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(PlayerFormSchema),
    defaultValues: {
      playerCount: "3",
      names: ["", "", "", ""],
      penaltyPoints: defaultPenaltyPoints,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const storedPoints = localStorage.getItem("penaltyPoints");
    if (storedPoints) {
      const points: PenaltyPoint[] = JSON.parse(storedPoints);
      points.forEach((p, i) => setValue(`penaltyPoints.${i}.value`, p.value));
    }
  }, [setValue]);

  const onSubmit = (data: FormValues) => {
    const count = Number(data.playerCount);
    const selectedNames = data.names.slice(0, count);

    const players: Player[] = selectedNames.map((name, i) => ({
      id: i + 1,
      name,
      score: 0,
    }));

    dispatch(setPlayers(players));
    dispatch(setPenaltyPoints(data.penaltyPoints));
    localStorage.setItem("penaltyPoints", JSON.stringify(data.penaltyPoints));
    toast.success("Bắt đầu trận đấu!");
  };

  return (
    <div className="px-3 pt-6 pb-10 md:w-2/3 md:mx-auto overflow-y-auto max-h-[100dvh]">
      <Card
        className={cn(
          "rounded-[32px] border-none shadow-2xl transition-all duration-500 overflow-hidden",
          isMinimal
            ? "bg-white dark:bg-slate-900 shadow-slate-200 dark:shadow-none"
            : "bg-gradient-to-b from-[#1a3d32] to-[#0d211a] border-2 border-[#2a4d40] text-white"
        )}
      >
        <CardHeader
          className={cn(
            "pb-4",
            !isMinimal && "bg-black/20 border-b border-white/5"
          )}
        >
          <CardTitle className="flex items-center gap-2 text-xl uppercase tracking-tight">
            <Users className="w-5 h-5" /> Thiết lập trận đấu
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* CHỌN SỐ NGƯỜI */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">
                Số lượng cơ thủ
              </Label>
              <div className="flex p-1 gap-1 rounded-2xl bg-black/10 dark:bg-white/5 border border-white/5">
                {[3, 4].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={playerCount === num ? "default" : "ghost"}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-bold transition-all",
                      playerCount === num
                        ? "shadow-md"
                        : "hover:bg-white/5 opacity-50"
                    )}
                    onClick={() => {
                      setPlayerCount(num as 3 | 4);
                      setValue("playerCount", String(num) as "3" | "4");
                    }}
                  >
                    {num} Người
                  </Button>
                ))}
              </div>
            </div>

            {/* NHẬP TÊN */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">
                Danh sách người chơi
              </Label>
              <div className="grid gap-3">
                {Array(playerCount)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="relative">
                      <Controller
                        control={control}
                        name={`names.${i}`}
                        render={({ field }) => (
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-30">
                              P{i + 1}
                            </span>
                            <Input
                              {...field}
                              placeholder={`Tên người chơi ${i + 1}`}
                              className={cn(
                                "h-12 pl-12 rounded-xl border-none transition-all",
                                isMinimal
                                  ? "bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                                  : "bg-white/5 focus:bg-white/10 text-white placeholder:text-white/20"
                              )}
                            />
                          </div>
                        )}
                      />
                      {errors.names?.[i] && (
                        <p className="text-[10px] text-red-400 mt-1 ml-4 font-bold">
                          {errors.names[i]?.message}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* CÀI ĐẶT ĐIỂM */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Settings2 className="w-4 h-4 opacity-50" />
                <Label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Quy định điểm số
                </Label>
              </div>
              <div
                className={cn(
                  "grid grid-cols-3 gap-2 p-3 rounded-2xl",
                  isMinimal ? "bg-slate-50 dark:bg-slate-800" : "bg-black/20"
                )}
              >
                {defaultPenaltyPoints.map((p, i) => (
                  <div key={p.key} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold opacity-50">
                      Bi {p.key}
                    </span>
                    <Controller
                      control={control}
                      name={`penaltyPoints.${i}.value`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          className={cn(
                            "h-10 text-center font-bold rounded-lg border-none",
                            isMinimal
                              ? "bg-white dark:bg-slate-700"
                              : "bg-white/10 text-yellow-400"
                          )}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4 h-14 rounded-2xl text-lg font-black uppercase tracking-tighter"
            >
              <PlayCircle className="w-6 h-6 mr-2" /> Bắt đầu ngay
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-[10px] opacity-40 uppercase tracking-[0.3em]">
        Lưu ý: Điểm số sẽ được tự động lưu
      </p>
    </div>
  );
};

export default PlayerForm;

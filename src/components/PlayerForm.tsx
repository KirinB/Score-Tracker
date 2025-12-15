import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  setPlayers,
  setPenaltyPoints,
  type Player,
  type PenaltyPoint,
} from "@/stores/slices/game.slice";

import { toast } from "sonner";

// --- Default Penalty Points
const defaultPenaltyPoints: PenaltyPoint[] = [
  { key: 3, value: 1 },
  { key: 6, value: 2 },
  { key: 9, value: 3 },
];

// --- Zod schema
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
          message: "Tên phải có ít nhất 2 ký tự",
          path: ["names", i],
        });
      }
    });
  });

type FormValues = z.infer<typeof PlayerFormSchema>;

const PlayerForm: React.FC = () => {
  const dispatch = useDispatch();
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
      names: Array(4).fill(""),
      penaltyPoints: defaultPenaltyPoints,
    },
    mode: "onSubmit",
  });

  // const watchedNames = watch("names");
  // const watchedPenaltyPoints = watch("penaltyPoints");

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
    toast.success("Đã bắt đầu trò chơi!");
  };

  return (
    <div className="pt-[env(safe-area-inset-top)] px-2 md:w-2/3 md:mx-auto">
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>Chọn số người chơi & setup điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Chọn số người */}
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={playerCount === 3 ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPlayerCount(3);
                  setValue("playerCount", "3");
                }}
              >
                3 Người
              </Button>
              <Button
                type="button"
                variant={playerCount === 4 ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setPlayerCount(4);
                  setValue("playerCount", "4");
                }}
              >
                4 Người
              </Button>
            </div>

            {/* Tên người chơi */}
            <div className="space-y-4">
              {Array(playerCount)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Label>Người chơi {i + 1}</Label>
                    <Controller
                      control={control}
                      name={`names.${i}`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={`Tên người chơi ${i + 1}`}
                        />
                      )}
                    />
                    {errors.names?.[i] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.names[i]?.message}
                      </p>
                    )}
                  </div>
                ))}
            </div>

            {/* Bi 3,6,9 */}
            <div className="space-y-4 mt-4">
              <Label>Setup điểm Bi 3,6,9</Label>
              {defaultPenaltyPoints.map((p, i) => (
                <div key={p.key} className="flex items-center space-x-2">
                  <span>Bi {p.key}</span>
                  <Controller
                    control={control}
                    name={`penaltyPoints.${i}.value`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        className="w-20"
                        min={0}
                      />
                    )}
                  />
                  <span>điểm</span>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full mt-4" variant="success">
              Bắt đầu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerForm;

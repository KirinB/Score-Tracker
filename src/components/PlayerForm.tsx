import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  setPlayers,
  type Player,
  setPenaltyPoints,
} from "@/stores/slices/game.slice";

const defaultPenaltyPoints = [
  { key: 3, value: 1 },
  { key: 6, value: 2 },
  { key: 9, value: 3 },
];

const PlayerForm: React.FC = () => {
  const dispatch = useDispatch();
  const [playerCount, setPlayerCount] = useState<3 | 4>(3);
  const [names, setNames] = useState<string[]>(Array(4).fill(""));
  const [penaltyPoints, setLocalPenaltyPoints] = useState(defaultPenaltyPoints);

  // Nếu muốn load lại từ localStorage
  useEffect(() => {
    const storedPoints = localStorage.getItem("penaltyPoints");
    if (storedPoints) {
      setLocalPenaltyPoints(JSON.parse(storedPoints));
    }
  }, []);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handlePenaltyChange = (key: number, value: number) => {
    const newPoints = penaltyPoints.map((p) =>
      p.key === key ? { ...p, value } : p
    );
    setLocalPenaltyPoints(newPoints);
  };

  const handleStart = () => {
    const selectedNames = names.slice(0, playerCount);
    if (selectedNames.some((n) => n.trim() === "")) {
      alert("Vui lòng nhập đủ tên người chơi");
      return;
    }

    const players: Player[] = selectedNames.map((name, i) => ({
      id: i + 1,
      name,
      score: 0,
    }));

    dispatch(setPlayers(players));
    dispatch(setPenaltyPoints(penaltyPoints));
    localStorage.setItem("penaltyPoints", JSON.stringify(penaltyPoints));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Chọn số người chơi & setup điểm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chọn 3 hoặc 4 người */}
        <div className="flex space-x-2">
          <Button
            variant={playerCount === 3 ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPlayerCount(3)}
          >
            3 Người
          </Button>
          <Button
            variant={playerCount === 4 ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPlayerCount(4)}
          >
            4 Người
          </Button>
        </div>

        {/* Nhập tên người chơi */}
        <div className="space-y-2">
          {Array(playerCount)
            .fill(0)
            .map((_, i) => (
              <div key={i}>
                <Label>Người chơi {i + 1}</Label>
                <Input
                  value={names[i]}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Tên người chơi ${i + 1}`}
                />
              </div>
            ))}
        </div>

        {/* Setup điểm cho các mức đền */}
        <div className="space-y-2">
          <Label>Setup điểm cho các mức đền</Label>
          {penaltyPoints.map((p) => (
            <div key={p.key} className="flex items-center space-x-2">
              <span>Bi {p.key}</span>
              <Input
                type="number"
                value={p.value}
                onChange={(e) =>
                  handlePenaltyChange(p.key, parseInt(e.target.value) || 0)
                }
                className="w-20"
              />
              <span>điểm</span>
            </div>
          ))}
        </div>

        <Button className="w-full mt-2" onClick={handleStart}>
          Bắt đầu
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;

import { Flame, Target } from "lucide-react";

interface AchievementBadgeProps {
  playerId: number;
  achievements: {
    topBi9Id: number;
    maxTurnId: number;
    topBi9Count: number;
    maxTurnScore: number;
  };
}

const AchievementBadge = ({
  playerId,
  achievements,
}: AchievementBadgeProps) => {
  const isTopBi9 =
    playerId === achievements.topBi9Id && achievements.topBi9Count > 0;
  const isMaxTurn =
    playerId === achievements.maxTurnId && achievements.maxTurnScore > 0;

  if (!isTopBi9 && !isMaxTurn) return null;

  return (
    <div className="flex gap-2 items-center ml-1">
      {/* Vua Bi 9 - Hiển thị số lượng trực tiếp */}
      {isTopBi9 && (
        <div className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-sm border border-white/5">
          <Target className="size-3 text-yellow-500/90" />
          <span className="text-[9px] font-black text-yellow-500/90 leading-none">
            {achievements.topBi9Count}
          </span>
        </div>
      )}

      {/* Lượt cơ cao nhất - Hiển thị điểm số trực tiếp */}
      {isMaxTurn && (
        <div className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-sm border border-white/5">
          <Flame className="size-3 text-orange-500/90" />
          <span className="text-[9px] font-black text-orange-500/90 leading-none">
            +{achievements.maxTurnScore}
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;

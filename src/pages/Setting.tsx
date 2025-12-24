import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setIsMinimal } from "@/stores/slices/theme.slice";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";
import FooterContact from "@/components/ui/FooterContact";

const Setting = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);
  const isMinimal = useSelector((state: RootState) => state.theme.isMinimal);

  // Class style cho Switch giống iPhone
  const iosSwitchClass =
    "scale-125 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-slate-700 transition-all duration-300";

  return (
    <div className="px-4 pt-6 md:w-2/3 md:mx-auto">
      <Card
        className={cn(
          "rounded-[24px] border-none shadow-xl transition-all duration-500",
          isMinimal
            ? "bg-white dark:bg-slate-900 shadow-slate-200 dark:shadow-none"
            : "bg-gradient-to-b from-[#1a3d32] to-[#0d211a] border-2 border-[#2a4d40] text-white"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span>⚙️</span> Cài đặt
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 py-6">
          {/* Chế độ tối */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                className="text-lg font-semibold cursor-pointer"
                htmlFor="dark-mode"
              >
                Dark mode
              </Label>
              <p className="text-xs opacity-60">
                Chuyển đổi giao diện Sáng/Tối
              </p>
            </div>
            <Switch
              id="dark-mode"
              className={iosSwitchClass}
              checked={theme === "dark"}
              onCheckedChange={() => dispatch(toggleTheme())}
            />
          </div>

          <div
            className={cn(
              "h-[1px] w-full",
              isMinimal ? "bg-slate-100 dark:bg-slate-800" : "bg-white/10"
            )}
          />

          {/* Chế độ Đơn giản (Minimal) */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                className="text-lg font-semibold cursor-pointer"
                htmlFor="minimal-mode"
              >
                Giao diện đơn giản
              </Label>
              <p className="text-xs opacity-60">
                Tắt hiệu ứng bàn bida và khung gỗ
              </p>
            </div>
            <Switch
              id="minimal-mode"
              className={iosSwitchClass}
              checked={isMinimal}
              onCheckedChange={(checked) => dispatch(setIsMinimal(checked))}
            />
          </div>
        </CardContent>
      </Card>

      <FooterContact />
    </div>
  );
};

export default Setting;

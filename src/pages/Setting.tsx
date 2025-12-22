import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/stores/slices/theme.slice";
import type { RootState } from "@/stores";

const Setting = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className="px-2 pt-6 md:w-2/3 md:mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Cài đặt</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <Label>Tự động lưu dữ liệu</Label>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label>Âm thanh</Label>
            <Switch defaultChecked />
          </div> */}

          <div className="flex items-center justify-between">
            <Label>Dark mode</Label>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => dispatch(toggleTheme())}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;

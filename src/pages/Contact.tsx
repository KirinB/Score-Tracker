import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";
import { Facebook, Bug, MessageCircle } from "lucide-react";
import FooterContact from "@/components/ui/FooterContact";
import { APP_INFO } from "@/const/app";

const Contact = () => {
  const { isMinimal } = useSelector((state: RootState) => state.theme);

  return (
    <div className="px-4 pt-6 md:w-2/3 md:mx-auto">
      <Card
        className={cn(
          "rounded-[24px] border-none shadow-xl transition-all duration-500 overflow-hidden",
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
          <CardTitle className="flex items-center gap-2 text-xl">
            <span>🎱</span> Ứng dụng tính điểm
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "p-3 rounded-2xl",
                isMinimal ? "bg-slate-100 dark:bg-slate-800" : "bg-white/10"
              )}
            >
              <Bug
                className={cn(
                  "w-6 h-6",
                  isMinimal ? "text-slate-600" : "text-emerald-400"
                )}
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">Báo lỗi & Góp ý</h3>
              <p className="text-sm opacity-70 leading-relaxed">
                Nếu bạn gặp bất kỳ sự cố nào hoặc có ý tưởng mới để nâng cấp ứng
                dụng, đừng ngần ngại nhắn tin cho tôi.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "h-px w-full",
              isMinimal ? "bg-slate-100 dark:bg-slate-800" : "bg-white/10"
            )}
          />

          <a
            href="https://www.facebook.com/ebs.bi/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 group",
              isMinimal
                ? "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
            )}
          >
            <div className="flex items-center gap-3">
              <Facebook className="w-6 h-6 text-[#1877F2]" />
              <div className="flex flex-col">
                <span className="font-bold">{APP_INFO.author}</span>
                <span className="text-xs opacity-50">facebook.com/ebs.bi</span>
              </div>
            </div>
            <MessageCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <div className="pt-4 text-center">
            <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">
              Made with ❤️ for Billiard Lovers
            </p>
          </div>
        </CardContent>
      </Card>

      <FooterContact />
    </div>
  );
};

export default Contact;

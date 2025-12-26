import { Home, Settings, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      label: "Trang Chủ",
      icon: Home,
      path: "/",
    },
    {
      label: "Liên Hệ",
      icon: MessageCircle,
      path: "/contact",
    },
    {
      label: "Cài đặt",
      icon: Settings,
      path: "/settings",
    },
    // {
    //   label: "Test",
    //   icon: TestTube2,
    //   path: "/test-voice",
    // },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 text-xs transition-colors
                ${
                  isActive
                    ? "text-blue-600 font-medium"
                    : "text-muted-foreground hover:text-blue-500"
                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default Footer;
